import 'reflect-metadata';
import 'mocha';
import { assert } from 'chai';
import { CharacterService } from '../modules/character/services/character.service';
import { StatType } from '../models/enums';

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService();
  });

  // We're using actual json character data
  // for this test instead of mocking the character
  it('should get a character', () => {
    const character = service.getByName('Briv');
    assert.equal('Briv', character.name);
  });

  it('should calculate Briv max hp correctly', () => {
    const character = service.getByName('Briv');
    const maxHp = service.calculateMaxHp(character);
    assert.equal(45, maxHp);
  });

  it('should calculate Briv stat bonus correctly', () => {
    // Briv has CON 14 with +2. CON 16 should have +3 bonus.
    const character = service.getByName('Briv');
    const bonus = service.calculateStatBonus(character, StatType.Constitution);
    assert.equal(3, bonus);
  });

  // The DDB version of this project contains more unit tests
  // but this version contains critical tests only.
  // Improvements: Add
  /**
   * CalculateMaxHp_RequiresNonNullCharacter
   * CalculateMaxHp_RequiresNonNullCharacterClasses
   * CalculateMaxHp_RequiresAtLeastOneCharacterClass
   * CalculateStatBonus_RequiresNonNullStats
   * CalculateStatBonus_DoesNotRequireItems
   * CalculateStatBonus_StacksBonuses
   * CalculateStatBonus_UsesCorrectStat
   */
});
