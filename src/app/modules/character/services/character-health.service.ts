import { CharacterHealth } from '../../../models/character-health';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';

// For simplicity in this demo, I'm not creating a separate character health repository.
// Ideally, this service would interact with a repository to perform load and save methods.

export interface ICharacterHealthService {
  getCharacterHealth(name: string): CharacterHealth;
  save(characterHealth: CharacterHealth): void;
}

@injectable()
export class CharacterHealthService implements ICharacterHealthService {
  private healthDictionary: Map<string, CharacterHealth>;
  constructor() {
    this.healthDictionary = new Map<string, CharacterHealth>();
    let temp = new CharacterHealth();
    temp.currentHp = 10;
    temp.name = 'briv';
    this.healthDictionary.set('briv', temp);
  }

  public getCharacterHealth(name: string): CharacterHealth {
    return this.healthDictionary.has(name.toLowerCase())
      ? this.healthDictionary.get(name.toLowerCase())
      : null;
  }

  public save(characterHealth: CharacterHealth): void {
    console.log(characterHealth);
    if (!characterHealth || !characterHealth.name) {
      throw new RangeError(
        'characterHealth must not be null and must have a valid name'
      );
    }
    this.healthDictionary.set(
      characterHealth.name.toLowerCase(),
      characterHealth
    );
  }
}
