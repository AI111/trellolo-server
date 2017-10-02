import {format, isString} from "util";
import {Request} from "../models/IExpress";
export interface ISearchParams {
    name: string;
    type: string;
    format: string;
}
export function typeParser(type: string, mask: string, value: string): object {
    const obj = {};
    obj[type] =  format(mask, value);
    return obj;
}
export function buildQueryByParams( where: object, q: object, searchParams: [ISearchParams] | string[] ): object {
    if (!searchParams.length) return where;
    const query = {};
    const isString = typeof searchParams[0] === "string";
    if (typeof searchParams[0] === "string") {
        (searchParams as string[]).filter((parameter) => q[parameter])
            .forEach((item: string) => (query[item] = q[item]));
    } else {
        (searchParams as [ISearchParams]).filter((parameter) => q[parameter.name])
            .forEach((item: ISearchParams) => (query[item.name] = typeParser(item.type, item.format, q[item.name])));
    }
    return Object.assign(where, query);
}
