import * as tasks from "../../../model/tasks"

// Get completed tasks
export default defineEventHandler(async (event) => {
    try {
        const id = event.context.params.id
        const res = await tasks.getCompleted(id);
        return { tasks: res }
    } catch (err) {
        return { err: err }   
    }
})