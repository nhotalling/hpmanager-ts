import { DamageType, DefenseType } from './enums';

export class Character {
  name: string;
  level: number;
  classes: Array<CharacterClass>;
  stats: CharacterStats;
  items: Array<Item>;
  defenses: Array<Defense>;
}

export class CharacterClass {
  name: string;
  hitDiceValue: number;
  classLevel: number;
}

export class CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export class Item {
  name: string;
  modifier: Modifier;
}

export class Defense {
  type: DamageType;
  defense: DefenseType;
}

export class Modifier {
  affectedObject: string;
  affectedValue: string;
  value: number;
}
