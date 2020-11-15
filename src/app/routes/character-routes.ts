import { Request, Response, Application } from 'express';
import container from '../inversify.config';
import { TYPES } from '../types';
import { ICharacterManager } from '../modules/character/character.manager';

const characterManager = container.get<ICharacterManager>(
  TYPES.CharacterManager
);

export class CharacterRoutes {
  public routes(app: Application): void {
    app.route('/api/v1/character').get((req: Request, res: Response) => {
      res.status(200).send({ hello: characterManager.test() + ' interface' });
    });

    app.route('/api/v1/character/:name').get((req: Request, res: Response) => {
      const name = req.params.name;
      const character = characterManager.getCharacter(name);
      const status = character == null ? 404 : 200;
      res.status(status).send(character);
    });

    app
      .route('/api/v1/character/:name/status')
      .get((req: Request, res: Response) => {
        const name = req.params.name;
        const health = characterManager.getStatus(name);
        const status = health == null ? 404 : 200;
        res.status(status).send(health);
      });
  }
}
