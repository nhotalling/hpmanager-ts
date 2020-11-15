import { inject, injectable } from 'inversify';
import { Character } from '../../models/character-models';
import { TYPES } from '../../types';
import { ICharacterService } from './services/character.service';
import { ICharacterHealthService } from './services/character-health.service';
import { CharacterHealth } from '../../models/character-health';

export interface ICharacterManager {
  test(): string;
  //   CharacterHealth AddTempHp(string name, int amount);
  //   CharacterHealth DealDamage(string name, IEnumerable<DamageRequest> damage);
  //   int CalculateDamage(IEnumerable<DamageRequest> damageRequest, IEnumerable<Defense> defenses);
  //   CharacterHealth ApplyDamage(int damage, CharacterHealth originalHealth);
  getCharacter(name: string): Character;
  getStatus(name: string): CharacterHealth;
  //   CharacterHealth Heal(string name, int amount);
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
    console.log(character);
    console.log(character.items[0].modifier.affectedValue);
    return character;
  }

  public getStatus(name: string): CharacterHealth {
    //return this.characterHealthService.getCharacterHealth(name);
    let health = this.characterHealthService.getCharacterHealth(name);
    health.currentHp -= 1;
    this.characterHealthService.save(health);
    return health;
  }

  private name() {}

  public test(): string {
    return 'Character Manager from interface! (docker)';
  }
}
