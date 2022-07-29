const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // there should be a request and even if there is one, it must have roles using optional chaining(?.)
    if(!req?.roles) return res.sendStatus(401); //Unauthorized
    const rolesArr = [...allowedRoles];
    // For Testing
    console.log(rolesArr);
    console.log(req.roles);

    // Map out the request roles to a new array that is a boolean arr checking which roles someone has.
        // Uses .find() to see which role the user has and will return the 1st role with true result; 
            // Hierarchy of Roles: Admin --> Editor --> User
    const result = req.roles.map(role => rolesArr.includes(role)).find(val => val === true);
    // sends 401 unauthorized becuase if no roles, user shouldnt even exist
    if(!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
