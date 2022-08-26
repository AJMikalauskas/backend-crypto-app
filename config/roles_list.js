// These are really only ever used for database access levels
    // Admin is the top level, editor goes beyond a user's permissions in the fact they can edit,
        // not just view only.
const ROLES_LIST = {
    "Admin": 5150,
    "Editor": 1984,
    "User": 2001
}

module.exports = ROLES_LIST;