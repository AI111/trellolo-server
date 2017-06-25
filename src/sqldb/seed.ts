/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

"use strict";
import {Config as config} from "../config/environment";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {db} from "./index";

export function seedDatabase() {
    const User = db.User  ;
    // if (config.seedDB) {
        User.destroy({where: {}})
            .then(() => User.bulkCreate([{
                provider: "local",
                name: "Test User",
                email: "test@example.com",
                password: "test",
            }, {
                provider: "local",
                name: "Test User2",
                email: "test2@example.com",
                password: "test",
            }, {
                provider: "local",
                name: "Test User3",
                email: "test3@example.com",
                password: "test",
            }, {
                provider: "local",
                name: "Test User4",
                email: "test4@example.com",
                password: "test",
            }, {
                provider: "local",
                role: "admin",
                name: "Admin",
                email: "admin@example.com",
                password: "admin",
            }])
                .then(() => console.log("finished populating users"))
                .catch((err) => console.log("error populating users", err)));
       var  user = db.User.build({
            name: 'Fake User',
            email: 'fake@example.com',
            password: 'password'
        });
        return user.save()
            .then(user => db.Project.create({
                name: 'name',
                description:'trollolo',
                active: true
            }))
            .then(p => {
                db.Team.create({
                    project: p._id,
                    user: user._id,
                    teamName:'test'
                })
            })
    // }

}
