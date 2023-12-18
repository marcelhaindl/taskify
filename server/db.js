const mysql = require("mysql2/promise");

// /**
//  * # openDB()
//  * Function to open a database connection on the localhost
//  * @returns the mysql database connection
//  */
// async function openDB() {
//     return mysql.createConnection({
//         host: "atp.fhstp.ac.at",
//         port: "8007",
//         user: process.env.DB_LOCALHOST_USERNAME,
//         password: process.env.DB_LOCALHOST_PASSWORD,
//         database: "cc221005",
//         multipleStatements: true,
//     });
// }

/**
 * # openDB()
 * Function to open a database connection on the node server
 * @returns the mysql database connection
 */
async function openDB() {
    return mysql.createConnection({
        host: "169.254.255.253",
        port: "3306",
        user: process.env.DB_NODE_USERNAME,
        password: process.env.DB_NODE_PASSWORD,
        database: "node_cc221005_10055",
        multipleStatements: true,
    });
}

/**
 * # dbQuery()
 * Function to make a basic database query. It first of all opens the database, then makes the query and finally closes the database connection again.
 * 
 * ## Parameters
 * @param {String} sql - SQL Query
 * @param {Array} values - Values that need to be hand over to the sql query 
 * 
 * ## Return
 * @returns the changed rows of the database query
 */
async function dbQuery({ sql, values }) {
    const db = await openDB(); // Open DB
    const [rows] = await db.query(sql, values); // Use DB
    await db.end(); // Close DB
    return rows;
}

module.exports = { dbQuery };    