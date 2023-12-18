import * as tasks from "../../model/tasks"

// Get all tasks
export default defineEventHandler(async () => {
    try {
        const res = await tasks.getAll();
        return { tasks: res }
    } catch (err) {
        return { err: err }   
    }
})