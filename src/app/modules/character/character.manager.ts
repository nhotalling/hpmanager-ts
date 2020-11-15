import { inject, injectable } from 'inversify';
import { Character } from '../../models/character-models';
import { TYPES } from '../../types';
import { ICharacterService } from './services/character.service';

export interface ICharacterManager {
  test(): string;
  //   CharacterHealth AddTempHp(string name, int amount);
  //   CharacterHealth DealDamage(string name, IEnumerable<DamageRequest> damage);
  //   int CalculateDamage(IEnumerable<DamageRequest> damageRequest, IEnumerable<Defense> defenses);
  //   CharacterHealth ApplyDamage(int damage, CharacterHealth originalHealth);
  getCharacter(name: string): Character;
  //   CharacterHealth GetStatus(string name);
  //   CharacterHealth Heal(string name, int amount);
}

@injectable()
export class CharacterManager implements ICharacterManager {
  private characterService: ICharacterService;

  constructor(
    @inject(TYPES.CharacterService) characterService: ICharacterService
  ) {
    this.characterService = characterService;
  }

  getCharacter(name: string) {
    return this.characterService.getByName(name);
  }

  public test(): string {
    return 'Character Manager from interface! (docker)';
  }
}
