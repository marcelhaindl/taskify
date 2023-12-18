import * as tasks from "../../model/tasks"

// Delete a task
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id;
        const res = await tasks.remove(id)
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
