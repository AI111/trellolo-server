/**
 * Created by sasha on 6/7/17.
 */
import {Instance, Model} from "sequelize";

export interface IUserAttributes {
    _id?: number;
    name?: string;
    email?: string;
    role?: string;
    password?: string;
    provider?: string;
    salt?: string;
    facebook?: string;
    twitter?: string;
    google?: string;
    github?: string;
}

export interface IUserInstance  extends Instance<IUserAttributes>, IUserAttributes {
    dataValues: IUserAttributes;

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate(password: string, callback?: (err: Error, sucess: boolean) => void);

    /**
     * Make salt
     *
     * @param {Number} [byteSize] - Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt(...args);
    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword(password: string, callback: (err:Error, sucess: boolean) => void);
    /**
     * Update password field
     *
     * @param {Function} fn
     * @return {String}
     * @api public
     */
    updatePassword(fn: Error|string);
    profile(): IUserAttributes;
}
export interface IUserModel extends Model<IUserInstance, IUserAttributes>{

}