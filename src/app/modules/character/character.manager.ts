import { inject, injectable } from 'inversify';
import { Character, Defense } from '../../models/character-models';
import { TYPES } from '../../types';
import { ICharacterService } from './services/character.service';
import { ICharacterHealthService } from './services/character-health.service';
import { CharacterHealth } from '../../models/character-health';
import { DamageRequest } from '../../models/damage-request';

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
    var health = this.getCharacterHealth(name);
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

    var maxHp = this.characterService.calculateMaxHp(character);
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
    throw new Error('Method not implemented.');
    // var originalHealth = GetCharacterHealth(name);
    // // GetCharacterHealth has null checks for character, so we can assume character is not null
    // var character = _characterService.GetCharacter(name);
    // var damageTaken = CalculateDamage(damageRequest, character.Defenses);
    // if (damageTaken == 0) {
    //   return originalHealth;
    // }
    // var updatedHealth = ApplyDamage(damageTaken, originalHealth);
    // _characterHealthService.Save(updatedHealth);
    // return updatedHealth;
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
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
