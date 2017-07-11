/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

"use strict";
import {Config as config} from "../config/environment";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {db} from "./index";
import {ProjectAccessRights} from "../models/team/ITeam";
function clearAllTables(){
    return db.User.destroy({where: {}})
        .then(() => db.Project.destroy({where:{}}))
        .then(() => db.Board.destroy({where:{}}))
        .then(() => db.Card.destroy({where:{}}))
        .then(() => db.Team.destroy({where:{}}))
        .then(() => db.ProjectColumn.destroy({where:{}}))
        .then(() => db.BoardToUser.destroy({where:{}}))
}
function seedUsers(){
   return db.User.bulkCreate([{
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

}
function createTestProjects(){
    return function (users) {
        let  user = db.User.build({
            name: 'Fake User',
            email: 'fake@example.com',
            password: 'password'
        });
        return user.save()
            .then(user => db.Project.create({
                title: 'name',
                description:'trollolo',
                active: true
            }))
            .then(p => db.Team.create({
                    projectId: p._id,
                    userId: user._id,
                    teamName:'test',
                    accessRights: ProjectAccessRights.creator
                })
            );
    }
}
export function seedDatabase() {
    if (config.seedDB) {
       return clearAllTables()
            .then(seedUsers)
            .then(createTestProjects())
        .then(() => console.log("finished populating users"))
        .catch((err) => console.log("error populating users", err));
    }
}
