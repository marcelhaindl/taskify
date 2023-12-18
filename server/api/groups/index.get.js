import * as groups from "../../model/groups"

// Get all groups
export default defineEventHandler(async () => {
    try {
        const res = await groups.getAll();
        res.forEach((group) => {
            group.members = JSON.parse(group.members);
        })
        return { groups: res }
    } catch (err) {
        return { err: err }   
    }
})