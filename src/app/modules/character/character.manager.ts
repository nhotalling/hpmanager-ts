import { inject, injectable } from 'inversify';
import { Character, Defense } from '../../models/character-models';
import { TYPES } from '../../types';
import { ICharacterService } from './services/character.service';
import { ICharacterHealthService } from './services/character-health.service';
import { CharacterHealth } from '../../models/character-health';
import { DamageRequest } from '../../models/damage-request';

export interface ICharacterManager {
  addTempHp(name: string, amount: number): CharacterHealth;
  dealDamage(name: string, damage: Array<DamageRequest>): CharacterHealth;
  calculateDamage(
    damageRequest: Array<DamageRequest>,
    defenses: Array<Defense>
  ): number;
  applyDamage(damage: number, originalHealth: CharacterHealth): CharacterHealth;
  getCharacter(name: string): Character;
  getStatus(name: string): CharacterHealth;
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

  public getCharacter(name: string): Character {
    const character = this.characterService.getByName(name);
    return character;
  }

  public getStatus(name: string): CharacterHealth {
    return this.getCharacterHealth(name);
  }

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

  addTempHp(name: string, amount: number): CharacterHealth {
    var health = this.getCharacterHealth(name);
    let newTempHp = 0;

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

  dealDamage(name: string, damage: DamageRequest[]): CharacterHealth {
    throw new Error('Method not implemented.');
  }
  calculateDamage(damageRequest: DamageRequest[], defenses: Defense[]): number {
    throw new Error('Method not implemented.');
  }
  applyDamage(
    damage: number,
    originalHealth: CharacterHealth
  ): CharacterHealth {
    throw new Error('Method not implemented.');
  }
  heal(name: string, amount: number): CharacterHealth {
    throw new Error('Method not implemented.');
  }
}
