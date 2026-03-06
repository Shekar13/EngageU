const User = require("../models/User");

module.exports = async (req, res, next) => {
    const userId = req.headers.userid;

    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
        return res.status(403).json({ msg: "Super Admin access only" });
    }

    req.user = user;
    next();
};
