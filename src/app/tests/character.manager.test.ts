import 'reflect-metadata';
import 'mocha';
import { instance, mock, verify, when } from 'ts-mockito';
import { assert } from 'chai';
import { CharacterService } from '../modules/character/services/character.service';
import { CharacterHealthService } from '../modules/character/services/character-health.service';
import { CharacterManager } from '../modules/character/character.manager';
import { CharacterHealth } from '../models/character-health';

describe('CharacterManager', () => {
  let mockedCharacterServiceClass: CharacterService;
  let mockedCharacterServiceInstance: CharacterService;
  let mockedCharacterHealthServiceClass: CharacterHealthService;
  let mockedCharacterHealthServiceInstance: CharacterHealthService;

  let service: CharacterManager;

  beforeEach(() => {
    mockedCharacterServiceClass = mock(CharacterService);
    mockedCharacterServiceInstance = instance(mockedCharacterServiceClass);
    mockedCharacterHealthServiceClass = mock(CharacterHealthService);
    mockedCharacterHealthServiceInstance = instance(
      mockedCharacterHealthServiceClass
    );
    service = new CharacterManager(
      mockedCharacterServiceInstance,
      mockedCharacterHealthServiceInstance
    );
  });

  it('addTempHp subtracts if negative', () => {
    let charHealth = new CharacterHealth();
    charHealth.tempHp = 10;
    when(
      mockedCharacterHealthServiceClass.getCharacterHealth('Briv')
    ).thenReturn(charHealth);

    var result = service.addTempHp('Briv', -2);

    assert.equal(8, result.tempHp);
  });

  it('addTempHp adds initial amount', () => {
    let charHealth = new CharacterHealth();
    charHealth.tempHp = 0;
    when(
      mockedCharacterHealthServiceClass.getCharacterHealth('Briv')
    ).thenReturn(charHealth);

    var result = service.addTempHp('Briv', 2);

    assert.equal(2, result.tempHp);
  });

  it('addTempHp keeps existing amount', () => {
    let charHealth = new CharacterHealth();
    charHealth.tempHp = 10;
    when(
      mockedCharacterHealthServiceClass.getCharacterHealth('Briv')
    ).thenReturn(charHealth);

    var result = service.addTempHp('Briv', 2);

    assert.equal(10, result.tempHp);
  });

  it('addTempHp overwrites existing amount', () => {
    let charHealth = new CharacterHealth();
    charHealth.tempHp = 2;
    when(
      mockedCharacterHealthServiceClass.getCharacterHealth('Briv')
    ).thenReturn(charHealth);

    var result = service.addTempHp('Briv', 10);

    assert.equal(10, result.tempHp);
  });

  // The DDB version of this project contains more unit tests
  // but this version contains critical tests only.
  // Improvements: Add
  /**
   *
   */
});
