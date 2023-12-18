import { escape } from "mysql2";
import { dbQuery } from "../../db";
import { v4 as uuid } from "uuid";

const tableTasks = "taskifyTasks"

/**
 * # getAll()
 * Select all tasks from the database
 * @returns the result of the database query
 */
export const getAll = async () => {
    const sql = `SELECT * FROM ${tableTasks}`;
    return await dbQuery({ sql: sql });
};

/**
 * # getByID()
 * Selects a task with the corresponding ID from the database
 * @param {String} id - ID of the task you want to select 
 * @returns the result of the database query
 */
export const getByID = async (id) => {
    const sql = `SELECT * FROM ${tableTasks} WHERE id = "${id}"`;
    return await dbQuery({ sql: sql });
};

/**
 * # create()
 * Creates a task
 * @param {Object} task - Task you want to create 
 * @returns the result of the database query
 */
export const create = async (task) => {
    const sql = `INSERT INTO ${tableTasks} (` +
        `id, ` +
        `title, ` +
        `description, ` +
        `due_date, ` +
        `creator_id, ` +
        `group_id, ` +
        `completed) VALUES (?,?,?,?,?,?,?)`;
    const values = [
        uuid(),
        task.title,
        task.description,
        task.dueDate,
        task.creatorID,
        task.groupID,
        escape(0),
    ];

    return await dbQuery({ sql: sql, values: values });
}

/**
 * # update()
 * Updates a task
 * @param {Object} task - Task data that needs to be updated 
 * @param {String} id - ID of the task 
 * @returns the result of the database query
 */
export const update = async (task, id) => {
    const sql = `UPDATE ${tableTasks} SET ` +
        `title = ?, ` +
        `description = ?, ` +
        `due_date = ?, ` +
        `group_id = ?, ` +
        `completed = ? ` +
        `WHERE id = "${id}"`;

    const values = [
        task.title,
        task.description,
        task.dueDate,
        task.groupID,
        task.completed,
    ];

    return await dbQuery({ sql: sql, values: values });
}

/**
 * # remove()
 * Deletes a task from the database
 * @param {String} id - ID of the task that needs to be deleted 
 * @returns the result of the database query
 */
export const remove = async (id) => {
    const sql = `DELETE FROM ${tableTasks} WHERE id = "${id}"`;
    return await dbQuery({ sql: sql });
}

/**
 * # getCompleted()
 * Selects all completed tasks where the current user is the creator of or group tasks where the user is part of
 * @param {String} id - ID of the current user 
 * @returns all completed tasks of the current user
 */
export const getCompleted = async (id) => {
    const sql = `SELECT * FROM taskifyTasks ` +
        `WHERE completed = 1 ` +
        `AND ((creator_id = "${id}") ` +
        `OR group_id IN (` +
        `SELECT id ` +
        `FROM taskifyGroups ` +
        `WHERE JSON_CONTAINS(members, '"${id}"')))`;
    return await dbQuery({ sql: sql });
};

/**
 * # getUpcoming()
 * Selects all upcoming tasks where the current user is the creator of or group tasks where the user is part of
 * @param {String} id - ID of the current user 
 * @returns all upcoming tasks of the current user
 */
export const getUpcoming = async (id) => {
    const sql = `SELECT * FROM taskifyTasks ` +
        `WHERE completed = 0 ` +
        `AND ((creator_id = "${id}") ` +
        `OR group_id IN (` +
        `SELECT id ` +
        `FROM taskifyGroups ` +
        `WHERE JSON_CONTAINS(members, '"${id}"')))`;

    return await dbQuery({ sql: sql });
}

/**
 * markCompleted()
 * Marks the task with the corresponding ID as completed or not, depending on the [completed] input
 * @param {Boolean} completed - Whether the task should be marked completed or not
 * @param {String} id - ID of the task 
 * @returns the result of the database query
 */
export const markCompleted = async (completed, id) => {
    const sql = `UPDATE ${tableTasks} SET ` +
        `completed = ? WHERE id = "${id}"`;

    const values = [completed];

    return await dbQuery({ sql: sql, values: values });
}