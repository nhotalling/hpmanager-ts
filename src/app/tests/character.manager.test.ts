import 'reflect-metadata';
import 'mocha';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { assert } from 'chai';
import { CharacterService } from '../modules/character/services/character.service';
import { CharacterHealthService } from '../modules/character/services/character-health.service';
import { CharacterManager } from '../modules/character/character.manager';
import { CharacterHealth } from '../models/character-health';
import { DamageType, DefenseType } from '../models/enums';
import { DamageRequest } from '../models/damage-request';
import { Defense } from '../models/character-models';

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

  it('calculateDamage applies immunity', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 6,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Immunity,
        type: DamageType.Slashing,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(6, result);
  });

  it('calculateDamage does not apply immunity', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 6,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Immunity,
        type: DamageType.Acid,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(16, result);
  });

  it('calculateDamage applies vulnerability', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 6,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Vulnerability,
        type: DamageType.Cold,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(22, result);
  });

  it('calculateDamage does not apply vulnerability', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 6,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Vulnerability,
        type: DamageType.Thunder,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(16, result);
  });

  it('calculateDamage applies resistance', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 7,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Resistance,
        type: DamageType.Cold,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(13, result);
  });

  it('calculateDamage does not apply resistance', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 6,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Resistance,
        type: DamageType.Thunder,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(16, result);
  });

  it('calculateDamage attacks Briv with Flame Tongue', () => {
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Slashing,
        value: 9,
      },
      {
        type: DamageType.Fire,
        value: 6,
      },
    ];
    const defense: Array<Defense> = [
      {
        defense: DefenseType.Immunity,
        type: DamageType.Fire,
      },
      {
        defense: DefenseType.Resistance,
        type: DamageType.Slashing,
      },
    ];

    const result = service.calculateDamage(damage, defense);

    assert.equal(4, result);
  });

  it('applyDamage damage exceeds temp hp', () => {
    const health: CharacterHealth = {
      currentHp: 30,
      maxHp: 30,
      tempHp: 5,
      name: 'Test',
    };

    const result = service.applyDamage(10, health);

    assert.equal(0, result.tempHp);
    assert.equal(25, result.currentHp);
  });

  it('applyDamage temp hp exceeds damage', () => {
    const health: CharacterHealth = {
      currentHp: 30,
      maxHp: 30,
      tempHp: 5,
      name: 'Test',
    };

    const result = service.applyDamage(4, health);

    assert.equal(1, result.tempHp);
    assert.equal(30, result.currentHp);
  });

  it('applyDamage damage exceeds hp', () => {
    // App only allows hp to go down to 0
    const health: CharacterHealth = {
      currentHp: 30,
      maxHp: 30,
      tempHp: 0,
      name: 'Test',
    };

    const result = service.applyDamage(100, health);

    assert.equal(0, result.tempHp);
    assert.equal(0, result.currentHp);
  });

  it('applyDamage hp exceeds damage', () => {
    const health: CharacterHealth = {
      currentHp: 30,
      maxHp: 30,
      tempHp: 0,
      name: 'Test',
    };

    const result = service.applyDamage(12, health);

    assert.equal(0, result.tempHp);
    assert.equal(18, result.currentHp);
  });

  it('dealDamage saves the new result', () => {
    // for purposes of this demo, we'll use the
    // live version of the Character Service to load
    // json data for Briv
    service = new CharacterManager(
      new CharacterService(),
      mockedCharacterHealthServiceInstance
    );
    const originalHealth: CharacterHealth = {
      name: 'Briv',
      maxHp: 45,
      currentHp: 45,
      tempHp: 0,
    };
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Cold,
        value: 6,
      },
      {
        type: DamageType.Slashing,
        value: 10,
      },
    ];

    when(
      mockedCharacterHealthServiceClass.getCharacterHealth('Briv')
    ).thenReturn(originalHealth);

    var result = service.dealDamage('Briv', damage);
    const savedObject = capture<CharacterHealth>(
      mockedCharacterHealthServiceClass.save
    ).last()[0];

    verify(mockedCharacterHealthServiceClass.save(anything())).times(1);
    assert.equal(34, result.currentHp);
    assert.equal(34, savedObject.currentHp);
    assert.equal(originalHealth.maxHp, savedObject.maxHp);
    assert.equal(originalHealth.tempHp, savedObject.tempHp);
    assert.equal(originalHealth.name, savedObject.name);
  });

  it('dealDamage does not save the new result', () => {
    // No damage dealt, so no need to save the record
    service = new CharacterManager(
      new CharacterService(),
      mockedCharacterHealthServiceInstance
    );
    const originalHealth: CharacterHealth = {
      name: 'Briv',
      maxHp: 45,
      currentHp: 45,
      tempHp: 0,
    };
    const damage: Array<DamageRequest> = [
      {
        type: DamageType.Fire,
        value: 1000,
      },
    ];

    when(
      mockedCharacterHealthServiceClass.getCharacterHealth('Briv')
    ).thenReturn(originalHealth);

    var result = service.dealDamage('Briv', damage);

    verify(mockedCharacterHealthServiceClass.save(anything())).times(0);
    assert.equal(originalHealth.currentHp, result.currentHp);
  });
});
