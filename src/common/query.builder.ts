import {Request} from "../models/IExpress";
import {isString} from "util";
export interface ISearchParams {
    name: string;
    type: string;
}
export function typeParser(type: string, value: string): object {
    if(type.includes("like")) return ({$like: type.replace(/like/, value)});
}
export function buildQueryByParams( where: object, q: object, searchParams: [ISearchParams] | [string] ): object {
    if (!searchParams.length) return where;
    const query = {};
    const isString = typeof searchParams[0] === "string";
    if (typeof searchParams[0] === "string"){
        (searchParams as [string]).filter((parameter) => q[parameter])
            .forEach((item: string) => (query[item] = q[item]));
    } else {
        (searchParams as [ISearchParams]).filter((parameter) => q[parameter.name])
            .forEach((item: ISearchParams) => (query[item.name] = typeParser(item.type, q[item.name])));
    }
    return Object.assign(where, query);
}
