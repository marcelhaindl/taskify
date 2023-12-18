import * as groups from "../../model/groups"

// Delete a group
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await groups.remove(id)
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
