import * as path from "path";
const config = {
    userRoles: ["guest", "user", "admin"],
    root: path.normalize(`${__dirname}/../../../`),
    env: process.env.NODE_ENV,
}
export default config;