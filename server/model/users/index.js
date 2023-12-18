import { dbQuery } from "../../db";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const tableUsers = "taskifyUsers"

/**
 * # getAll()
 * Selects every user from the database.
 * @returns the result of the database query
 */
export const getAll = async () => {
    const sql = `SELECT * FROM ${tableUsers}`;
    return await dbQuery({ sql: sql });
};

/**
 * # getById()
 * Selects a single user from the database.
 * @param {String} id - ID of the user
 * @returns the result of the database query
 */
export const getByID = async (id) => {
    const sql = `SELECT * FROM ${tableUsers} WHERE id = "${id}"`;
    return await dbQuery({ sql: sql });
};

/**
 * # create()
 * Creates a user.
 * @param {Object} user - user that needs to be created
 * @returns the result of the database query
 */
export const create = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const sql = `INSERT INTO ${tableUsers} (` +
        `id, ` +
        `first_name, ` +
        `last_name, ` +
        `email, ` +
        `password) VALUES (?,?,?,?,?)`;
    const values = [
        uuid(),
        user.firstName,
        user.lastName,
        user.email,
        hashedPassword
    ];

    return await dbQuery({ sql: sql, values: values });
}

/**
 * # update()
 * Updates a user with the corresponding id
 * @param {Object} user - User data that needs to be updated
 * @param {String} id - ID of the user
 * @returns the result of the database query
 */
export const update = async (user, id) => {
    if (user.password !== "") {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const sql = `UPDATE ${tableUsers} SET ` +
            `first_name = ?, ` +
            `last_name = ?, ` +
            `email = ?, ` +
            `password = ? ` +
            `WHERE id = "${id}"`;

        const values = [
            user.firstName,
            user.lastName,
            user.email,
            hashedPassword,
        ];

        return await dbQuery({ sql: sql, values: values });
    } else {
        const sql = `UPDATE ${tableUsers} SET ` +
            `first_name = ?, ` +
            `last_name = ?, ` +
            `email = ? ` +
            `WHERE id = "${id}"`;

        const values = [
            user.firstName,
            user.lastName,
            user.email,
        ];

        return await dbQuery({ sql: sql, values: values });
    }
}

/**
 * # remove()
 * Function to delete a user and its corresponding tasks.
 * Also removes the user from the groups he is in and changes the admin of the groups where the user is admin of.
 * @param {String} id - ID of the user that needs to be deleted 
 * @returns the result of the database query
 */
export const remove = async (id) => {
    const sql = `START TRANSACTION; ` +
        `DELETE FROM taskifyUsers WHERE id = '${id}'; ` +
        `UPDATE taskifyGroups SET members = JSON_REMOVE(members, JSON_UNQUOTE(JSON_SEARCH(members, 'one', '${id}'))) WHERE JSON_CONTAINS(members, '["${id}"]'); ` +
        `DELETE FROM taskifyGroups WHERE admin IS NULL AND JSON_LENGTH(members) = 0; ` +
        `UPDATE taskifyGroups SET admin = REPLACE(JSON_EXTRACT(members, '$[0]'), '"', '') WHERE admin IS NULL AND JSON_LENGTH(members) > 0; ` +
        `DELETE FROM taskifyTasks WHERE creator_id IS NULL AND group_id IS NULL; ` +
        `COMMIT;`;

    return await dbQuery({ sql: sql });
}