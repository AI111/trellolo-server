'use strict';
import {ISocialCreds, ServerConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================

export class TestConfig extends ServerConfig{
  seedDB = false;
  secrets = {
    session: "trellolo & trollolo",
    reCaptchaSecrer: "6LcVDiYUAAAAAFrTfOqmiGwZOnSxbi-Oz-VGA64b",
  };
  dbConfig = {
    uri: 'sqlite://',
    options: {
      host: 'localhost',
      port: 3306,
      dialect: 'test.sqlite',
      logging: console.log
    }
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