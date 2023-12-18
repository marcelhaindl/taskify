import * as tasks from "../../model/tasks"

// Create a task
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const res = await tasks.create(body);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})