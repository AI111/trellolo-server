'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users',
            [
                {"_id":1, "name":"Test User", "avatar":"uploads/pop.jpg", "email":"test@example.com", "role":"user", "password":"a5MIi9AGAZrBBkqTmzSNp96DZ32iOsiS1To3OpOOohTwxiDl4A78H7y+Is/k+6/pcvYJ4nXn2+HYG6yTLgTQog==", "provider":"local", "salt":"Bh5Meqbl4mlsIHP7H1mS7g==", "facebook":"", "twitter":"", "google":"", "github":"", "createdAt":"2017-07-23 17:26:44", "updatedAt":"2017-07-23 17:26:44"},
                {"_id":2, "name":"Test User2", "avatar":"uploads/pop.jpg", "email":"test2@example.com", "role":"user", "password":"jFgw++k9R91gLOUBFD/6KLtA7BzbvaVxBwOUOt1GDlTwDOPNqNT/AcjCACY/krKPdCsPj7fP4QpmeMQ1BtvArQ==", "provider":"local", "salt":"Xs5A0dmZLIFyLAtszpAKMw==", "facebook":"", "twitter":"", "google":"", "github":"", "createdAt":"2017-07-23 17:26:44", "updatedAt":"2017-07-23 17:26:44"},
                {"_id":3, "name":"Test User3", "avatar":"uploads/pop.jpg", "email":"test3@example.com", "role":"user", "password":"GhmLrtPT+8zMIyF2eOVPg2mcOC99xpKi46RCYvfPwBH/dup/S68bJvM00e/V0OwThcubM90uqK7wAWThvhSTDw==", "provider":"local", "salt":"UUWEqT2ekng5e/IRSJZrHQ==", "facebook":"", "twitter":"", "google":"", "github":"", "createdAt":"2017-07-23 17:26:44", "updatedAt":"2017-07-23 17:26:44"},
                {"_id":4, "name":"Test User4", "avatar":"uploads/pop.jpg", "email":"test4@example.com", "role":"user", "password":"3Q9GNoh3vP+Oljr3grgq63Yz3Luwju4qDVxfhZXLrTV1o+w1hs2PEU9gCWVCdR30bjeumSVhPO/Pyp0UfM3rKw==", "provider":"local", "salt":"oRL6ojiCPS55XvU/HA6v9Q==", "facebook":"", "twitter":"", "google":"", "github":"", "createdAt":"2017-07-23 17:26:44", "updatedAt":"2017-07-23 17:26:44"},
                {"_id":5, "name":"Fake User", "avatar":"uploads/pop.jpg", "email":"fake@example.com", "role":"user", "password":"gJ+oCFVHK5eSFQPoHV/5M7Afv+EJhXLnXpUiQ7slBllOOLXzxPi7O0FA+uudPYG20dn9mSWLCElab4E1Aq5XtQ==", "provider":"", "salt":"Jy/n/4W9MC7fZg6v0kSNuQ==", "facebook":"", "twitter":"", "google":"", "github":"", "createdAt":"2017-07-23 17:26:44", "updatedAt":"2017-07-23 17:26:44"},
                {"_id":6, "name":"Admin", "avatar":"uploads/pop.jpg", "email":"admin@example.com", "role":"admin", "password":"39zF1xX5NCFI4XxOET6dfqa0ZKg5YneioYzO33xzo67YgaAhe9iASC4+/pKSgSxgvDtoX2tmjqZxpIGUs0e0HQ==", "provider":"local", "salt":"trKZfyBV+0W64sp+1uZa9g==", "facebook":"", "twitter":"", "google":"", "github":"", "createdAt":"2017-07-23 17:26:44", "updatedAt":"2017-07-23 17:26:44"}]
            , {});
    },
    //all passwords: 111111
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', {
            // where:{
            //     _id : 1
            // }
        }, {});
    }
};
