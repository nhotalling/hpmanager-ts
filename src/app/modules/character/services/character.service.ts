import { Character } from '../../../models/character-models';
import { injectable } from 'inversify';

// For simplicity, I'm not creating a separate character repository

export interface ICharacterService {
  getByName(name: string): Character;
}

@injectable()
export class CharacterService implements ICharacterService {
  private characterData: Character[];
  constructor() {
    this.characterData = require('../../../data/characters.json');
  }

  public getByName(name: string): Character {
    const character = this.characterData.find(
      (obj) => obj.name.toLowerCase() === name.toLowerCase()
    );

    return character;
  }
}
