import { inject, injectable } from 'inversify';
import { Character, Defense } from '../../models/character-models';
import { TYPES } from '../../types';
import { ICharacterService } from './services/character.service';
import { ICharacterHealthService } from './services/character-health.service';
import { CharacterHealth } from '../../models/character-health';
import { DamageRequest } from '../../models/damage-request';
import { DefenseType } from '../../models/enums';
import { Calculations } from '../../shared/calculations';

export interface ICharacterManager {
  /**
   * Adds temporary HP to a character. Temp HP do not stack.
   * @param name The character's name (case-insensitive)
   * @param amount Amount of temporary HP to add. (Negative numbers allowed)
   */
  addTempHp(name: string, amount: number): CharacterHealth;

  /**
   * Calculates and applies the specified damage to a character, taking into account
   * vulnerability, immunity, and resistance.
   * @param name The character's name (case-insensitive)
   * @param damage Array of damage types and amount of damage to deal
   */
  dealDamage(name: string, damage: Array<DamageRequest>): CharacterHealth;

  /**
   * Evaluates damage types and values against a character's defenses
   * and returns the total damage dealt.
   * @param damageRequest Array of damage types and amount of damage to deal
   * @param defenses The character's defenses that may modify the damage dealt
   */
  calculateDamage(
    damageRequest: Array<DamageRequest>,
    defenses: Array<Defense>
  ): number;

  /**
   * Applies calculated damage, taking temporay hit points into account.
   * (Note this does not deal with unconsciousness/death)
   * @param damage The amount of damage to apply
   * @param originalHealth The health object to apply damage to
   */
  applyDamage(damage: number, originalHealth: CharacterHealth): CharacterHealth;

  /**
   * Get a character by name
   * @param name The character's name (case-insensitive)
   */
  getCharacter(name: string): Character;

  /**
   * Gets a character's max HP, current HP, and temporary HP
   * @param name The character's name (case-insensitive)
   */
  getStatus(name: string): CharacterHealth;

  /**
   * Heals a character, up to their max HP value.
   * @param name The character's name (case-insensitive)
   * @param amount The amount of HP to recover
   */
  heal(name: string, amount: number): CharacterHealth;
}

@injectable()
export class CharacterManager implements ICharacterManager {
  private characterService: ICharacterService;
  private characterHealthService: ICharacterHealthService;

  constructor(
    @inject(TYPES.CharacterService) characterService: ICharacterService,
    @inject(TYPES.CharacterHealthService) healthService: ICharacterHealthService
  ) {
    this.characterService = characterService;
    this.characterHealthService = healthService;
  }

  /**
   * Adds temporary HP to a character. Temp HP do not stack.
   * @param name The character's name (case-insensitive)
   * @param amount Amount of temporary HP to add. (Negative numbers allowed)
   */
  addTempHp(name: string, amount: number): CharacterHealth {
    let health = this.getCharacterHealth(name);
    let newTempHp = 0;
    amount = this.getInt(amount);

    if (amount < 0) {
      // Allowing user to send negative temp hp
      // as a means to correct an error
      newTempHp = health.tempHp + amount;
      newTempHp = Math.max(0, newTempHp);
    } else {
      // Temp HP do not stack
      newTempHp = Math.max(amount, health.tempHp);
    }

    health.tempHp = newTempHp;
    this.characterHealthService.save(health);

    return health;
  }

  /**
   * Get a character by name
   * @param name The character's name (case-insensitive)
   */
  public getCharacter(name: string): Character {
    const character = this.characterService.getByName(name);
    return character;
  }

  /**
   * Gets a character's max HP, current HP, and temporary HP
   * @param name The character's name (case-insensitive)
   */
  public getStatus(name: string): CharacterHealth {
    return this.getCharacterHealth(name);
  }

  /**
   * Gets a characters health from the service (repo).
   * If not found, it loads the character and calculates its
   * max HP, then stores the health value for use during this session.
   * @param name
   */
  private getCharacterHealth(name: string): CharacterHealth {
    let currentHealth = this.characterHealthService.getCharacterHealth(name);
    if (currentHealth != null) {
      return currentHealth;
    }

    const character = this.characterService.getByName(name);
    if (character == null) {
      return null; // TODO - This could be an exception that turns into a 404
    }

    let maxHp = this.characterService.calculateMaxHp(character);
    currentHealth = {
      name: character.name,
      maxHp: maxHp,
      currentHp: maxHp,
      tempHp: 0,
    };
    this.characterHealthService.save(currentHealth);

    return currentHealth;
  }

  /**
   * Calculates and applies the specified damage to a character, taking into account
   * vulnerability, immunity, and resistance.
   * @param name The character's name (case-insensitive)
   * @param damage Array of damage types and amount of damage to deal
   */
  dealDamage(name: string, damage: Array<DamageRequest>): CharacterHealth {
    let originalHealth = this.getCharacterHealth(name);
    if (originalHealth === null) {
      // getCharacterHealth must have a matching character or it will return null
      throw new Error('Character not found');
    }

    let character = this.characterService.getByName(name);
    let damageTaken = this.calculateDamage(damage, character.defenses);
    if (damageTaken === 0) {
      return originalHealth;
    }

    let updatedHealth = this.applyDamage(damageTaken, originalHealth);
    this.characterHealthService.save(updatedHealth);
    return updatedHealth;
  }

  /**
   * Evaluates damage types and values against a character's defenses
   * and returns the total damage dealt.
   * @param damageRequest Array of damage types and amount of damage to deal
   * @param defenses The character's defenses that may modify the damage dealt
   */
  calculateDamage(
    damageRequest: Array<DamageRequest>,
    defenses: Array<Defense>
  ): number {
    if (!damageRequest || damageRequest.length === 0) {
      return 0;
    }
    if (!defenses) {
      defenses = new Array<Defense>();
    }
    let damageTaken = 0;

    damageRequest.forEach((damage) => {
      // Not allowing negative damage. Could consider throwing an error.
      let damageToApply = Math.max(0, this.getInt(damage.value));

      // This if check could also check to see if no defenses match the damage type and apply all damage,
      // but that wouldn't handle the addition / subtraction portion down the road since it won't
      // necessarily be damage type specific (eg reduce all damage by 5)
      if (defenses.length === 0) {
        damageTaken += damageToApply;
        return; // continue
      }

      // immunity
      if (
        defenses.some(
          (defense) =>
            defense.defense === DefenseType.Immunity &&
            defense.type === damage.type
        )
      ) {
        return; // continue
      }

      let currentDamage = damageToApply;

      // apply any addition / subtraction
      // assumed this is out of scope for demo based on defense model

      // allow one resistance
      if (
        defenses.some(
          (defense) =>
            defense.defense === DefenseType.Resistance &&
            defense.type === damage.type
        )
      ) {
        currentDamage = Calculations.halfRoundDown(currentDamage);
      }

      // allow one vulnerability
      if (
        defenses.some(
          (defense) =>
            defense.defense === DefenseType.Vulnerability &&
            defense.type == damage.type
        )
      ) {
        currentDamage *= 2;
      }

      damageTaken += currentDamage;
    });

    return damageTaken;
  }

  /**
   * Applies calculated damage, taking temporay hit points into account.
   * (Note this does not deal with unconsciousness/death)
   * @param damage The amount of damage to apply
   * @param originalHealth The health object to apply damage to
   */
  applyDamage(
    damage: number,
    originalHealth: CharacterHealth
  ): CharacterHealth {
    damage = this.getInt(damage);
    if (damage <= 0) {
      // Not allowing negative damage. Could consider throwing an error.
      return originalHealth;
    }
    let updatedHealth = { ...originalHealth };
    let remainingDamage = damage;

    // the if checks aren't strictly necessary since the math.min would handle 0
    // but they help describe the intent.

    if (updatedHealth.tempHp > 0) {
      let tempDamage = Math.min(updatedHealth.tempHp, remainingDamage);
      updatedHealth.tempHp -= tempDamage;
      remainingDamage -= tempDamage;
    }

    if (remainingDamage > 0) {
      let hpDamage = Math.min(updatedHealth.currentHp, remainingDamage);
      updatedHealth.currentHp -= hpDamage;
      remainingDamage -= hpDamage;

      // if CurrentHp <= 0, character is unconscious
      // if remainingDamage >= MaxHp, character is killed
    }

    return updatedHealth;
  }

  /**
   * Heals a character, up to their max HP value.
   * @param name The character's name (case-insensitive)
   * @param amount The amount of HP to recover
   */
  heal(name: string, amount: number): CharacterHealth {
    throw new Error('Method not implemented.');
  }

  private getInt(value: number): number {
    const newValue = Math.floor(value);
    if (isNaN(newValue)) {
      throw new Error('Please provide a valid number');
    }
    return newValue;
  }
}
