import * as groups from "../../model/groups"
import { readBody } from "h3";

// Update a group
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const id = event.context.params.id;
        const res = await groups.update(body, id);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
