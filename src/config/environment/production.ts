"use strict";
import {IConfig, ISocialCreds} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
const config: IConfig = {
    seedDB: true,
    secrets: {
        session: "trellolo & trollolo",
        reCaptchaSecrer: "6LcVDiYUAAAAAFrTfOqmiGwZOnSxbi-Oz-VGA64b",
    },
    dbConfig: {
        dbName: "trellolo-prod",
        name: "root",
        password: "hello",
        options: {
            host: "localhost",
            port: 3306,
            dialect: "mysql",
            logging: console.log,
            omitNull: true,
        },
    },
    authConfig: {
        google: {
            clientID: "209851744107-j0gtt5vg2i3gm8fej04d0s3gjc91ji11.apps.googleusercontent.com",
            clientSecret: "f4sJYEIjFVy2XBsYousePlef",
            callbackURL: "/auth/google/callback",
        },
        github: {
            clientID: "b86d334243b9dc45e552",
            clientSecret: "9f222a23e99b493ec6c77e4ff97d967a2735c47c",
            callbackURL: "/auth/github/callback",
        },
    },
};
export default config;