import { Request, Response, Application } from 'express';

export class CharacterRoutes {
  public routes(app: Application): void {
    app.route('/character').get((req: Request, res: Response) => {
      res.status(200).send({ hello: 'world2' });
    });

    app.route('/character/:name').get((req: Request, res: Response) => {
      res.status(200).send({ hello: 'name' });
    });
  }
}
