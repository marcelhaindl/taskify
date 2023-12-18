import { dbQuery } from "../../db";
import { v4 as uuid } from "uuid";

const tableGroups = "taskifyGroups"

/**
 * # getAll()
 * Select all groups from the database
 * @returns the result of the database query
 */
export const getAll = async () => {
    const sql = `SELECT * FROM ${tableGroups}`;
    return await dbQuery({ sql: sql });
};

/**
 * # getByID()
 * Selects one group with the corresponding ID.
 * @param {String} id - ID of the group 
 * @returns the result of the database query 
 */
export const getByID = async (id) => {
    const sql = `SELECT * FROM ${tableGroups} WHERE id = "${id}"`;
    return await dbQuery({ sql: sql });
};

/**
 * # create()
 * Creates a group
 * @param {Object} group - Group that needs to be created 
 * @returns the result of the database
 */
export const create = async (group) => {
    const sql = `INSERT INTO ${tableGroups} (` +
        `id, ` +
        `name, ` +
        `description, ` +
        `members, ` +
        `admin) VALUES (?,?,?,?,?)`;
    const values = [
        uuid(),
        group.name,
        group.description,
        JSON.stringify(group.members),
        group.admin,
    ];

    return await dbQuery({ sql: sql, values: values });
}

/**
 * # update()
 * Updates a group
 * @param {Object} group - Group data that needs to be updated 
 * @param {String} id - ID of the group 
 * @returns the result of the database query
 */
export const update = async (group, id) => {
    const sql = `UPDATE ${tableGroups} SET ` +
        `name = ?, ` +
        `description = ?, ` +
        `members = ? ` +
        `WHERE id = "${id}"`;

    const values = [
        group.name,
        group.description,
        JSON.stringify(group.members),
    ];

    return await dbQuery({ sql: sql, values: values });
}

/**
 * # remove()
 * Delete a group
 * @param {String} id - ID of the group that needs to be deleted 
 * @returns the result of the database query
 */
export const remove = async (id) => {
    const sql = `DELETE FROM ${tableGroups} WHERE id = "${id}"`;
    return await dbQuery({ sql: sql });
}

/**
 * # updateMembersOnly()
 * Function to update only the members of the group
 * @param {Array} members - Members array that needs to updated
 * @param {String} id - ID of the group
 * @returns the result of the database query
 */
export const updateMembersOnly = async (members, id) => {
    const sql = `UPDATE ${tableGroups} SET ` +
        `members = ? ` +
        `WHERE id = "${id}"`;

    const values = [
        JSON.stringify(members),
    ];

    return await dbQuery({ sql: sql, values: values });
}

/**
 * # getGroupsByUserID()
 * Function to select all groups where a specific user is part of
 * @param {String} id - ID of the user
 * @returns all groups where the user with the [id] is member of
 */
export const getGroupsByUserID = async (id) => {
    const sql = `SELECT * FROM ${tableGroups} ` +
        `WHERE JSON_CONTAINS(members, '"${id}"')`;

    return await dbQuery({ sql: sql });
}