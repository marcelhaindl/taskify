import * as groups from "../../model/groups"

// Get a group
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await groups.getByID(id)
        res[0].members = JSON.parse(res[0].members);
        return { group: res[0] }
    } catch (err) {
        return { err: err }
    }
})
