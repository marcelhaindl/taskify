import * as auth from "../../auth";
import { getAll } from "../../model/users";

// Login
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const users = await getAll();
        const token = await auth.login({ credentials: body, users: users });
        return { token: token };
    } catch (err) {
        return { err: err }
    }
})