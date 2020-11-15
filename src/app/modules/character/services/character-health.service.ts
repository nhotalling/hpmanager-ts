import { CharacterHealth } from '../../../models/character-health';
import { injectable } from 'inversify';

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
  }

  public getCharacterHealth(name: string): CharacterHealth {
    return this.healthDictionary.has(name.toLowerCase())
      ? this.healthDictionary.get(name.toLowerCase())
      : null;
  }

  public save(characterHealth: CharacterHealth): void {
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
