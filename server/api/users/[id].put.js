import * as users from "../../model/users"
import { readBody } from "h3";

// Update a user
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const id = event.context.params.id;
        const res = await users.update(body, id);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
