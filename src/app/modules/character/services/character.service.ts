import { Character } from '../../../models/character';
import { injectable } from 'inversify';

// import characterData = require('../../../../data/characters.json');

// For simplicity, I'm not creating a separate character repository

export interface ICharacterService {
  getByName(name: string): Character;
}

@injectable()
export class CharacterService implements ICharacterService {
  public getByName(name: string): Character {
    return {
      name: 'From Char Service: ' + name,
      currentHp: 11,
      maxHp: 22,
      tempHp: 0,
    };
  }
}
