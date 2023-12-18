import * as users from "../../model/users"

// Delete a user
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await users.remove(id)
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
