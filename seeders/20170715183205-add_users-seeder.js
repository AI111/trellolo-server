'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.bulkInsert('Person', [{
         name: 'John Doe',
         isBetaMember: false
         }], {});
         */
        return queryInterface.bulkInsert('Users',
            [
                {
                    "_id" : 1,
                    "name" : "Test User",
                    "avatar" : null,
                    "email" : "test@example.com",
                    "role" : "user",
                    "password" : "Z7qkHpjZ/+P/pCTIK2YigLBnYTgDk9eEEKA8tXm4QLCBV8XB3lq8S6AOhp2Ks6zbBDcB6eTSMFH5p+WwGKazgA==",
                    "provider" : "local",
                    "salt" : "pzyGLdENtmJvtVXWK+mJ/A==",
                    "facebook" : null,
                    "twitter" : null,
                    "google" : null,
                    "github" : null,
                    "createdAt" : new Date(),
                    "updatedAt" : new Date()
                },
                {
                    "_id" : 2,
                    "name" : "Test User2",
                    "avatar" : null,
                    "email" : "test2@example.com",
                    "role" : "user",
                    "password" : "0mkQjFzuvLx5HQrNN6ImE65dbpiMGcuacdh7rVOHQv2CJ8z5JIdflpRlOjSZKXPj6kL0OL03w5S4/ncZB5ZKZQ==",
                    "provider" : "local",
                    "salt" : "aHddo4sg8cUeWcrArECAQw==",
                    "facebook" : null,
                    "twitter" : null,
                    "google" : null,
                    "github" : null,
                    "createdAt" : "2017-07-15 18:41:23",
                    "updatedAt" : "2017-07-15 18:41:23"
                },
                {
                    "_id" : 3,
                    "name" : "Test User3",
                    "avatar" : null,
                    "email" : "test3@example.com",
                    "role" : "user",
                    "password" : "lTjLsUmAeFcnV0rOSz4mu6Rz0V7BJlWj7CyuivpJVUdhOKYG05iOtT/JxSei6WhOYARcXo44br8Im+SAcA34xw==",
                    "provider" : "local",
                    "salt" : "kEs3sJj0BIL5QnU2cO1UWQ==",
                    "facebook" : null,
                    "twitter" : null,
                    "google" : null,
                    "github" : null,
                    "createdAt" : "2017-07-15 18:41:23",
                    "updatedAt" : "2017-07-15 18:41:23"
                },
                {
                    "_id" : 4,
                    "name" : "Test User4",
                    "avatar" : null,
                    "email" : "test4@example.com",
                    "role" : "user",
                    "password" : "HbNQV05aHCjkDZAPCBsylxsoc0bx26KjUJ5ksO13YE/LRbYj63tlRA0ZzntpTQ8pvGPg+OBDtGGOUJGqUsz3EQ==",
                    "provider" : "local",
                    "salt" : "f6LL9boNTVhAMucHGaR/CA==",
                    "facebook" : null,
                    "twitter" : null,
                    "google" : null,
                    "github" : null,
                    "createdAt" : "2017-07-15 18:41:23",
                    "updatedAt" : "2017-07-15 18:41:23"
                },
                {
                    "_id" : 5,
                    "name" : "Fake User",
                    "avatar" : null,
                    "email" : "fake@example.com",
                    "role" : "user",
                    "password" : "x0qupLQoD3DYCRO3Rxs5PMNYm3dql/dNojYK8hiLDxodTp1puTVMIh8UtSVecfmpunRDqBz8yPd4q77x4WCzFg==",
                    "provider" : null,
                    "salt" : "9ChzoLwOmfo5hz/OwXLkCQ==",
                    "facebook" : null,
                    "twitter" : null,
                    "google" : null,
                    "github" : null,
                    "createdAt" : "2017-07-15 18:41:23",
                    "updatedAt" : "2017-07-15 18:41:23"
                },
                {
                    "_id" : 6,
                    "name" : "Admin",
                    "avatar" : null,
                    "email" : "admin@example.com",
                    "role" : "admin",
                    "password" : "0inGJFQdgH2GkogeLjTlcLjh1ZCGukOV4+6VFLelMplFDbk/xkhFF4NWTt9npq75lkT1jmDFk3tMGn8XJMNt9Q==",
                    "provider" : "local",
                    "salt" : "spLZ6D5KgAdHr0AaWilXAA==",
                    "facebook" : null,
                    "twitter" : null,
                    "google" : null,
                    "github" : null,
                    "createdAt" : "2017-07-15 18:41:23",
                    "updatedAt" : "2017-07-15 18:41:23"
                }
            ]
            , {});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', {
            // where:{
            //     _id : 1
            // }
        }, {});
    }
};
