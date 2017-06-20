"use strict";
import {ISocialCreds, ServerConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
export class ProdConfig extends ServerConfig{
  port = process.env.OPENSHIFT_NODEJS_PORT
|| process.env.PORT
|| 8080;
  seedDB = false;
  secrets = {
    session: "trellolo & trollolo",
    reCaptchaSecrer: "6LcVDiYUAAAAAFrTfOqmiGwZOnSxbi-Oz-VGA64b",
  };
  dbConfig = {
    dbName: "trellolo-prod",
    name: "root",
    password: "hello",
    options: {
      host: "localhost",
      port: 3306,
      dialect: "mysql",
      logging: console.log,
    },
  };
  constructor(){
    super();
    const socialProviders = new Map<string, ISocialCreds>()
    socialProviders.set('google',{
      clientID: '209851744107-j0gtt5vg2i3gm8fej04d0s3gjc91ji11.apps.googleusercontent.com',
      clientSecret: 'f4sJYEIjFVy2XBsYousePlef',
      callbackURL: '/auth/google/callback',
    });
    this.authConfig = socialProviders;
  }
}
