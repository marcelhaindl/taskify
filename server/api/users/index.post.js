import * as users from "../../model/users"

// Create a user
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const res = await users.create(body);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})