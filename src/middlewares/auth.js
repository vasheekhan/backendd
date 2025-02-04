const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("ERROR: Token is missing!!!!!!!!!!");
    }

    const decodedMessage = jwt.verify(token, "Vashee@Bhai");
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("ERROR: User not found");
    }

    req.user = user; // 🔹 Attach user to req
    next();
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
