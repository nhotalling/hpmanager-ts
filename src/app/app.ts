import express from 'express';
import bodyParser from 'body-parser';
import { CharacterRoutes } from './routes/character-routes';

class App {
  public app: express.Application;
  public characterRoutes: CharacterRoutes = new CharacterRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.characterRoutes.routes(this.app);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
  }
}

export default new App().app;
