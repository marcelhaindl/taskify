import { verifyJWT } from "../../auth"

// Verify JWT
export default defineEventHandler(async (event) => {
    try {
        const token = await readBody(event);
        const res = verifyJWT(token);
        return res;
    } catch (err) {
        return { err: err, verified: false }
    }
})