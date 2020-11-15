import { Character } from '../../../models/character';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';

// import characterData = require('../../../../data/characters.json');

export interface ICharacterRepository {
  getByName(name: string): Character;
}

@injectable()
export class CharacterRepository implements ICharacterRepository {
  public getByName(name: string): Character {
    throw new Error('Method not implemented.');
  }
}
