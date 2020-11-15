let instance: CharacterHealthRepository = null;

import { CharacterHealth } from '../../models/character-health';

class CharacterHealthRepository {
  constructor() {
    // this.value = Math.random(100);
  }

  protected characterDictionary = new Map<string, CharacterHealth>();

  // getByName
  // save

  static getInstance() {
    if (!instance) {
      instance = new CharacterHealthRepository();
    }

    return instance;
  }
}

module.exports = CharacterHealthRepository;
