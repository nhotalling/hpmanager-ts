import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import {
  CharacterHealthService,
  ICharacterHealthService,
} from './modules/character/services/character-health.service';
import {
  CharacterService,
  ICharacterService,
} from './modules/character/services/character.service';
import {
  CharacterManager,
  ICharacterManager,
} from './modules/character/character.manager';

let container = new Container();

container
  .bind<ICharacterHealthService>(TYPES.CharacterHealthService)
  .to(CharacterHealthService)
  .inSingletonScope();
container
  .bind<ICharacterService>(TYPES.CharacterService)
  .to(CharacterService)
  .inSingletonScope();
container
  .bind<ICharacterManager>(TYPES.CharacterManager)
  .to(CharacterManager)
  .inSingletonScope();

export default container;
