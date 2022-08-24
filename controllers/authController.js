// Similar to useState() hook in react
const User = require('../model/User');
const bcrypt = require("bcrypt");
// JWT necessary imports
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  // Email and Password fields are required
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ 'message': "Email and Password are required." });

  // The email has to already exist, else they can't login; logic in registerController.js and refreshTokenController.js
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // evaluate password
  console.log(password);
  console.log(foundUser.password);
  const match = await bcrypt.compare(password, foundUser.password);
  // If the password matches, send success message, else, send a 401 unauthorized error code
  if (match) {
    console.log("passwords have matched");
    // define or add roles with access token, once the password is verified -> to handle the null values received, use .filter(Boolean)
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTS here
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "email": foundUser.email,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1200s" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // SAVING REFRESH TOKEN WITH CURRENT USER
      // MongoDB format
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    // Filters out the user who is currently logging in
    // const otherUsers = usersDB.users.filter(
    //   (person) => person.email !== foundUser.email
    // );
    // // Create a new user by using the foundUser yet also adding the refreshToken --> will allow us to invalidate user later
    // // based on logout functionality
    // const currentUser = { ...foundUser, refreshToken };
    // usersDB.setUsers([...otherUsers, currentUser]);

    // // Add updated usersDB to the users.json file
    // await fsPromises.writeFile(
    //   path.join(__dirname, "..", "model", "users.json"),
    //   JSON.stringify(usersDB.users)
    // );
    // Not available to JS if we send refreshToken as httpOnly cookie; maxAge is 1 day but in miliseconds.
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
    //  secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // send accessToken via here as res.json({}) --> send to memory, not localStorage or cookies
    res.json({ roles, accessToken });
    //res.json({ 'success': `User ${email} is logged in!`})
  } else {
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
