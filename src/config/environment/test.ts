"use strict";
import {IConfig} from "../../models/IConfig";
/*eslint no-process-env:0*/

// Test specific configuration
// ===========================
const config: IConfig = {
    secrets: {
        session: "trellolo & trollolo",
        reCaptchaSecrer: "6LcVDiYUAAAAAFrTfOqmiGwZOnSxbi-Oz-VGA64b",
    },
    dbConfig: {
        uri: "sqlite://",
        options: {
            host: "localhost",
            port: 3306,
            dialect: "test.sqlite",
            logging: false,
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
