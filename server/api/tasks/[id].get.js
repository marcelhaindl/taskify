import * as tasks from "../../model/tasks"

// Get a task
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await tasks.getByID(id)
        return { task: res[0] }
    } catch (err) {
        return { err: err }
    }
})
