const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

module.exports = () => {
	passport.use(new LocalStrategy({
		usernameField: "email",
		passwordField: "password",
	}, async (email, password, done) => {
		try {
			const exUser = await User.findOne({ where: { email }});
			console.log(exUser);
			if (exUser) {
				const result = await bcrypt.compare(password, exUser.password);
				if (result) {
					done(null, exUser);
				} else {
					done(null, false, { message: "비밀번호가 일치하지 않습니다." });
				}
			} else {
				done(null, false, { message: "존재하지 않는 사용자입니다." });
			}
		} catch (err) {
			console.error(err);
			done(err);
		}
	}));
};