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
  defenseType: DefenseType;
}

export class Modifier {
  affectedObject: string;
  affectedValue: string;
  value: number;
}

export enum DamageType {
  Acid = 'acid',
  Bludgeoning = 'bludgeoning',
  Cold = 'cold',
  Fire = 'fire',
  Force = 'force',
  Lightning = 'lightning',
  Necrotic = 'necrotic',
  Piercing = 'piercing',
  Poison = 'poison',
  Psychic = 'psychic',
  Radiant = 'radiant',
  Slashing = 'slashing',
  Thunder = 'thunder',
}

export enum DefenseType {
  Resistance = 'resistance',
  Vulnerability = 'vulnerability',
  Immunity = 'immunity',
}

export enum StatType {
  Strength = 'strength',
  Dexterity = 'dexterity',
  Constitution = 'constitution',
  Intelligence = 'intelligence',
  Wisdom = 'wisdom',
  Charisma = 'charisma',
}
