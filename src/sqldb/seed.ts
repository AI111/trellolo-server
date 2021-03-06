/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

"use strict";
import {config as config} from "../config/environment";
import {ProjectAccessRights} from "../models/team/ITeam";
import {IUserAttributes, IUserInstance} from "../models/user/IUser";
import {db} from "./index";
function clearAllTables() {
    return db.User.destroy({where: {}})
        .then(() => db.Project.destroy({where: {}}))
        .then(() => db.Board.destroy({where: {}}))
        .then(() => db.Card.destroy({where: {}}))
        .then(() => db.Team.destroy({where: {}}))
        .then(() => db.BoardColumn.destroy({where: {}}))
        .then(() => db.BoardToUser.destroy({where: {}}));
}
function seedUsers() {
    return db.User.bulkCreate([{
        _id: 1,
        provider: "local",
        name: "Test User",
        email: "test@example.com",
        password: "111111",
    }, {
        _id: 2,
        provider: "local",
        name: "Test User2",
        email: "test2@example.com",
        password: "111111",
    }, {
        _id: 3,
        provider: "local",
        name: "Test User3",
        email: "test3@example.com",
        password: "111111",
    }, {
        _id: 4,
        provider: "local",
        name: "Test User4",
        email: "test4@example.com",
        password: "111111",
    }, {
        _id: 5,
        name: "Fake User",
        email: "fake@example.com",
        password: "111111",
    }, {
        _id: 6,
        provider: "local",
        role: "admin",
        name: "Admin",
        email: "admin@example.com",
        password: "111111",
    }]);

}
function createTestProjects() {
    return function(users) {
        return db.User.create({
            name: "Fake User",
            email: "fake@example.com",
            password: "password",
        })
            .then((user) => db.Project.create({
                title: "name",
                description: "trollolo",
                active: true,
            })
                .then((p) => db.Team.create({
                    projectId: p._id,
                    userId: user._id,
                    teamName: "test",
                    accessRights: "creator",
                })
                    .then(() => user)));
    };
}
function createBoards() {
    return function(user) {
    };
}
export function seedDatabase() {
    if (config.seedDB) {
        return clearAllTables()
            .then(seedUsers)
            // .then(createTestProjects())
            .then(() => console.log("finished populating users"))
            .catch((err) => console.log("error populating users", err));
    }
}
