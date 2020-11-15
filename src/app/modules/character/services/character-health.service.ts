import { CharacterHealth } from '../../../models/character-health';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';

@injectable()
export class CharacterHealthService {
  protected characterDictionary: Map<string, CharacterHealth>;
  constructor() {
    this.characterDictionary = new Map<string, CharacterHealth>();
  }

  public get(name: string): CharacterHealth {
    return { name: 'TestGuy', currentHp: 11, maxHp: 22, tempHp: 0 };
  }

  public save(characterHealth: CharacterHealth): void {}
}
