/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import {db} from './index';
import {UserAttributes, UserInstance} from "../models/user/IUser";

export function seedDatabase() {
    let User= db.User  ;


    User.destroy({ where: {} })
        .then(() => User.bulkCreate([{
            provider: 'local',
            name: 'Test User',
            email: 'test@example.com',
            password: 'test'
        }, {
            provider: 'local',
            name: 'Test User2',
            email: 'test2@example.com',
            password: 'test'
        }, {
            provider: 'local',
            name: 'Test User3',
            email: 'test3@example.com',
            password: 'test'
        }, {
            provider: 'local',
            name: 'Test User4',
            email: 'test4@example.com',
            password: 'test'
        },{
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin'
        }])
            .then(() => console.log('finished populating users'))
            .catch(err => console.log('error populating users', err)));

}
