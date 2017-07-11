/**
 * Created by sasha on 6/25/17.
 */
import {spy,stub} from "sinon"
import {Response} from "express";

export const config = {
    projectName:'TEST PROJECT name 777',
    testEmail: 'test_email@trellolo.com',
    icon:"./test/assets/test.icon.jpeg"
};
export const req: any ={
    body:{
        user:{
            _id:777,
            role:'user'
        },
    }


};
export var res: any = {
    status:stub(),
    sendStatus:spy(),
    send:stub(),
    json:stub(),
    end:spy()
}