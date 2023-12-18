import * as groups from "../../model/groups"

// Create a group
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const res = await groups.create(body);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})