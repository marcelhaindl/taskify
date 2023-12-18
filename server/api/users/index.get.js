import * as users from "../../model/users"

// Get all users
export default defineEventHandler(async () => {
    try {
        const res = await users.getAll();
        return { users: res }
    } catch (err) {
        return { err: err }   
    }
})