const mongoose = require("mongoose");
const User = mongoose.model("users");
const userAgent = require("useragent");
const twilio = require("../utils/twilio");

module.exports = (req, res, next) => {
  let agent = userAgent.parse(req.headers["user-agent"]);
  device = agent.toString();
  let newlogin = 7 * 24 * 60 * 60 * 1000; //after seven days
  User.findOne({ _id: req.user.id }, (err, user) => {
    if (err) throw err;
    let phone = user.phone
      ? user.phone.toString().length === 13
        ? user.phone.toString().replace("2", "+2")
        : user.phone
      : user.email;

    if (
      !user.verified ||
      user.device != device ||
      Date.now() > user.lastLogin + newlogin
    ) {
      twilio.twilioVerify(phone);
      return res.send("Please Verify your account");
    }
    next(); 
  });
};
