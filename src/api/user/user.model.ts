"use strict";

import {pbkdf2, pbkdf2Sync, randomBytes} from "crypto";
const Sequilize = require("sequelize");
let authTypes = ["github", "twitter", "facebook", "google"];

let validatePresenceOf = function(value) {
    return value && value.length;
};
export class User extends Sequilize.Model{
    static  associate(models)  {
        console.log("User.associate");

        User.belongsToMany(models.Project, {
            through: {
                model: models.Team,
                unique: false,
            },
            foreignKey: "userId",
            as: "projects",
        });
        User.belongsToMany(models.Board, {
            through: {
                model: models.BoardToUser,
                unique: false,
            },
            foreignKey: "userId",
            as: "boards",
        });
    }
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    public authenticate(password): Promise<boolean> {
        let _this = this;
        return this.encryptPassword(password)
            .then( (pwdGen) => _this.password === pwdGen);
    }

    /**
     * Make salt
     *
     * @param {Number} [byteSize] - Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    public makeSalt(byteSize: number = 16): Promise<string> {
        return new Sequilize.Promise((resolve: (string) => void, reject: (string) => void) => {
            return randomBytes(byteSize, function(err, salt) {
                if (err) return reject(err);
                return resolve(salt.toString("base64"));
            });
        });

    }

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    public encryptPassword(password: string): Promise<string> {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = new Buffer(this.salt, "base64");

        return new Sequilize.Promise((resolve: (password: string) => void, reject: (err: any) => void) => {
            return pbkdf2(password, salt, defaultIterations, defaultKeyLength, "sha1",
                (err, key) => {
                    if (err) return reject(err);
                    return resolve(key.toString("base64"));
                });
        });

    }
    /**
     * Encrypt password sync
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    public encryptPassworSync(password: string): string {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = new Buffer(this.salt, "base64");
        // eslint-disable-next-line no-sync
        return pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, "sha1")
            .toString("base64");
    }
    /**
     * Update password field
     *
     * @param {Function} fn
     * @return {String}
     * @api public
     */
    public updatePassword(): Promise<void>  {
        // Handle new/update passwords
        if (!this.password) return Sequilize.Promise.resolve();

        if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
            return Sequilize.Promise.reject(new Error("Invalid password"));
        }
        // Make salt with a callback
        return this.makeSalt()
            .then((salt) => {
                this.salt = salt;
                return this.encryptPassword(this.password)
                    .then((hashedPassword) => {
                        this.password = hashedPassword;
                        return;
                    });
            });
    }
    get profile(){
            return {
                name: this.name,
                avatar: this.avatar,
                email: this.email,
                provider: this.provider,
                role: this.role,
            };
        }

}

export default function(sequelize, DataTypes) {
    User.init({
            _id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            avatar: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                unique: {
                    msg: "The specified email address is already in use.",
                },
                validate: {
                    isEmail: true,
                },
            },
            role: {
                type: DataTypes.STRING,
                defaultValue: "user",
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            provider: DataTypes.STRING,
            salt: DataTypes.STRING,
            facebook: DataTypes.STRING,
            twitter: DataTypes.STRING,
            google: DataTypes.STRING,
            github: DataTypes.STRING,

        },
        {
            sequelize,
            /**
             * Virtual Getters
             */
            getterMethods: {

            },
            /**
             * Pre-save hooks
             */
            hooks: {
                beforeBulkCreate(users, fields) {
                    return sequelize.Promise.all(users.map((user) => user.updatePassword()));
                },
                beforeCreate(user, fields, fn) {
                    return user.updatePassword();
                },
                beforeUpdate(user, fields, fn) {
                    if (user.changed("password")) return user.updatePassword();
                    return sequelize.Promise.resolve();
                },
            },
        });
    return User;
}
