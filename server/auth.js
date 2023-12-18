import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/**
 * # checkPassword()
 * Function to compare plain text password and hashed password.
 * 
 * @param {String} password - Plain text password
 * @param {String} hash - Hashed password 
 * @returns true or false, whether passwords are the same or not
 */
async function checkPassword({ password, hash }) {
    return await bcrypt.compare(password, hash);
}

/**
 * # login()
 * Function to login a user. It checks if the user exists and if the credentials are correct.
 * Additionally, it creates a JWT with the id of the user, the first name of the user and the last name of the user.
 * The JWT expires after 2 hours.
 * 
 * @param {Object} credentials - Credentials of the login input form
 * @param {Array} users - Array of all users
 * @returns the token of the JWT
 */
export async function login({ credentials, users }) {
    const user = users.find(u => {
        return u.email === credentials.email;
    });

    if (user && await checkPassword({ password: credentials.password, hash: user.password })) {
        const token = jwt.sign({ id: user.id, firstName: user.first_name, lastName: user.last_name }, ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        return token
    }
}

/**
 * # verifyJWT()
 * Function to verify the JWT.
 * @param {String} token - token of the JWT inside the cookie
 * @returns the error if there is one, else it returns the user.
 */
export function verifyJWT(token) {
    if (token) {
        return jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return { err: err, verified: false };
            } else {
                return { user: user, verified: true };
            }
        })
    }
    else {
        return { err: "unauthorized", verified: false };
    }
}