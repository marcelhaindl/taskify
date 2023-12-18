import * as users from "../../model/users"

// Get a user
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await users.getByID(id)
        return { user: res[0] }
    } catch (err) {
        return { err: err }
    }
})
