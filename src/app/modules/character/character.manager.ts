import { inject, injectable } from 'inversify';

export interface ICharacterManager {
  test(): string;
}

@injectable()
export class CharacterManager implements ICharacterManager {
  public test(): string {
    return 'Character Manager from interface! (docker)';
  }
}
