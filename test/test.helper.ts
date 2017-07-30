import {unlink} from "fs";

export function deleteFiles(pathArr: [string]): Promise<any[]> {
    return Promise.all(
        pathArr.map((path) => new Promise((resolve: () => void, reject: (err: any) => void) => {
            unlink(path, (err) => {
                if (err) reject(err);
                resolve();
            });
        })),
    );
}
