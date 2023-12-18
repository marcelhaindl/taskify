import * as tasks from "../../model/tasks"
import { readBody } from "h3";

// Update a task
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const id = event.context.params.id;
        const res = await tasks.update(body, id);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
