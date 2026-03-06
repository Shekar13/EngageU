const User = require("../models/User");

module.exports = async (req, res, next) => {
    const userId = req.headers.userid;

    if (!userId) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(401).json({ msg: "User does not exist" });
    }

    req.user = user;
    next();
};
