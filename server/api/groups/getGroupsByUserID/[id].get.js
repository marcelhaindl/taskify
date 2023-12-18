import * as groups from "../../../model/groups"

// Get a group by the users id
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await groups.getGroupsByUserID(id)
        return { groups: res }
    } catch (err) {
        return { err: err }
    }
})
