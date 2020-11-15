import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { CharacterHealthService } from './modules/character/services/character-health.service';
import {
  CharacterRepository,
  ICharacterRepository,
} from './modules/character/services/character.repository';
import {
  CharacterManager,
  ICharacterManager,
} from './modules/character/character.manager';

let container = new Container();

container
  .bind<CharacterHealthService>(TYPES.CharacterHealthService)
  .to(CharacterHealthService)
  .inSingletonScope();
container
  .bind<ICharacterRepository>(TYPES.CharacterRepository)
  .to(CharacterRepository)
  .inSingletonScope();
container
  .bind<ICharacterManager>(TYPES.CharacterManager)
  .toConstantValue(new CharacterManager());
//container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

export default container;
