export abstract class Calculations {
  public static getAvgHitPoints(hitDiceValue: number): number {
    return Math.ceil(hitDiceValue / 2) + 1;
  }

  public static halfRoundDown(value: number): number {
    return Math.floor(value / 2);
  }

  public static getStatModifier(statValue: number): number {
    return this.halfRoundDown(statValue - 10);
  }
}
