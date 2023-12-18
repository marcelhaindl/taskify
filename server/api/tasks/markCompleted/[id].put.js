import * as tasks from "../../../model/tasks"
import { readBody } from "h3";

// Mark a task as completed or undo completion
export default defineEventHandler(async (event) => {
    try {
        const { completed } = await readBody(event);
        const id = event.context.params.id;
        const res = await tasks.markCompleted(completed, id);
        return { res: res }
    } catch (err) {
        return { err: err }
    }
})
