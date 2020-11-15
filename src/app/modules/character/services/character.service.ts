import { Character } from '../../../models/character-models';
import { injectable } from 'inversify';
import { Calculations } from '../../../shared/calculations';
import { StatType } from '../../../models/enums';

// For simplicity, I'm not creating a separate character repository

export interface ICharacterService {
  getByName(name: string): Character;
  calculateMaxHp(character: Character): number;
  calculateStatBonus(character: Character, statType: StatType): number;
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

    return character ? character : null;
  }

  public calculateMaxHp(character: Character): number {
    if (character == null || character.classes?.length === 0) {
      throw new Error('Characters should include 1 or more classes');
    }

    var hp = 0;

    // Determine CON bonus to apply at every level
    var conBonus = this.calculateStatBonus(character, StatType.Constitution);

    var isFirstLevel = true;
    character.classes.forEach((charClass) => {
      var classLevels = charClass.classLevel;
      if (isFirstLevel) {
        // Get first level HP (max)
        // Improvement - Add an boolean to the CharacterClass that indicates if the class was the starting class.
        // For demo purposes, we will assume the first class in the list was the starting class
        isFirstLevel = false;
        hp = charClass.hitDiceValue + conBonus;
        classLevels -= 1;
      }

      hp += Calculations.getAvgHitPoints(charClass.hitDiceValue) * classLevels;
      hp += conBonus * classLevels;
    });

    return hp;
  }

  public calculateStatBonus(character: Character, statType: StatType): number {
    if (!character?.stats) {
      throw new Error('Characters should not have null Stats');
    }

    let statModifier = 0;
    let baseScore = 0;
    let affectedValues = new Array<string>();

    switch (statType) {
      case StatType.Strength:
        // Improvement: move magic strings to a constants file
        affectedValues = ['strength', 'str'];
        baseScore = character.stats.strength;
        break;
      case StatType.Dexterity:
        affectedValues = ['dexterity', 'dex'];
        baseScore = character.stats.dexterity;
        break;
      case StatType.Constitution:
        affectedValues = ['constitution', 'con'];
        baseScore = character.stats.constitution;
        break;
      case StatType.Intelligence:
        affectedValues = ['intelligence', 'int'];
        baseScore = character.stats.intelligence;
        break;
      case StatType.Wisdom:
        affectedValues = ['wisdom', 'wis'];
        baseScore = character.stats.wisdom;
        break;
      case StatType.Charisma:
        affectedValues = ['charisma', 'cha'];
        baseScore = character.stats.strength;
        break;
    }

    if (character.items?.length) {
      // Look for items that affect the specified stat
      character.items
        .filter(
          (item) =>
            item.modifier &&
            'stats' === item.modifier.affectedObject.toLowerCase() &&
            affectedValues.some(
              (affectedValue) =>
                affectedValue === item.modifier.affectedValue.toLowerCase()
            )
        )
        .forEach((item) => {
          // This assumes the character only has valid items
          // e.g. does not have multiple copies of the same type of magic item
          statModifier += item.modifier.value;
        });
    }

    return Calculations.getStatModifier(baseScore + statModifier);
  }
}
