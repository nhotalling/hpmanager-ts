import { Request, Response, Application } from 'express';
import container from '../inversify.config';
import { TYPES } from '../types';
import { ICharacterManager } from '../modules/character/character.manager';

const characterManager = container.get<ICharacterManager>(
  TYPES.CharacterManager
);

export class CharacterRoutes {
  public routes(app: Application): void {
    app.route('/character').get((req: Request, res: Response) => {
      res.status(200).send({ hello: characterManager.test() + ' interface' });
    });

    app.route('/character/:name').get((req: Request, res: Response) => {
      const name = req.params.name;
      const character = characterManager.getCharacter(name);
      const status = character == null || character == undefined ? 404 : 200;
      res.status(status).send(character);
    });
  }
}
