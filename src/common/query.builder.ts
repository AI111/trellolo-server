import {format} from "util";
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
    if (typeof searchParams[0] === "string") {
        (searchParams as string[]).filter((parameter) => q[parameter])
            .forEach((item: string) => (query[item] = q[item]));
    } else {
        (searchParams as [ISearchParams]).filter((parameter) => q[parameter.name])
            .forEach((item: ISearchParams) => (query[item.name] = typeParser(item.type, item.format, q[item.name])));
    }
    return Object.assign(where, query);
}
export function sortSortParrams(rules: string[], sort: string): string[][] {
    const desc = sort.charAt(0) === "-";
    const order = [desc ? sort.substring(1) : sort];
    if (!rules.includes(order[0])) return null;
    if (desc) order.push("DESC");
    return [order];
}
