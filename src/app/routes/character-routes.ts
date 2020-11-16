import { Request, Response, Application } from 'express';
import container from '../inversify.config';
import { TYPES } from '../types';
import { ICharacterManager } from '../modules/character/character.manager';

const characterManager = container.get<ICharacterManager>(
  TYPES.CharacterManager
);

export class CharacterRoutes {
  public routes(app: Application): void {
    /**
     * Gets json model for the given character to review its stats and defenses.
     */
    app.route('/api/v1/character/:name').get((req: Request, res: Response) => {
      const name = req.params.name;
      const character = characterManager.getCharacter(name);
      const status = character == null ? 404 : 200;
      res.status(status).send(character);
    });

    /**
     * Gets a character's current HP, maximum HP, and temporary HP.
     */
    app
      .route('/api/v1/character/:name/status')
      .get((req: Request, res: Response) => {
        const name = req.params.name;
        const health = characterManager.getStatus(name);
        const status = health == null ? 404 : 200;
        res.status(status).send(health);
      });

    /**
     * Adds temporary hit points, replacing the old value only if the new value is greater.
     * May also be used with a negative number to remove temporary HP.
     */
    app
      .route('/api/v1/character/:name/temp')
      .put((req: Request, res: Response) => {
        const name = req.params.name;
        const value = +req.query.value;
        const health = characterManager.addTempHp(name, value);
        res.status(200).send(health);
      });

    /**
     * Deals damage to the specified character, taking into account the character's damage
     * immunity, vulnerability, and resistance.
     */
    app
      .route('/api/v1/character/:name/damage')
      .put((req: Request, res: Response) => {
        const name = req.params.name;
        const damageRequest = req.body;
        const health = characterManager.dealDamage(name, damageRequest);
        res.status(200).send(health);
      });
  }
}
