const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

authController.loginWithEmail = async (req, res) => {

	try {
		const { email, password } = req.body;
		let user = await User.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				//토큰 생성
				const token = await user.generateToken();
				return res.status(200).json({ status: "Login success", user, token });
			}
		}
		throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
	} catch (error) {
		res.status(400).json({ status: "Fail login", error: error.message });
	}

}

authController.authenticate = async (req, res, next) => {
	try {
		//header에서 token값 가져오기
		const tokenString = req.headers.authorization;
		console.log("tokenString : ", tokenString);
		if (!tokenString) throw new Error("토큰 정보를 찾을 수 없습니다.");

		const token = tokenString.replace("Bearer ", "");
		//토큰이 유효하다면, 토큰의 `payload`를 반환
		jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
			if (error) throw new Error("토큰이 없거나 올바르지 않습니다.");
			req.userId = payload._id;
		});
		next();
	} catch (error) {
		res.status(400).json({ status: "토큰 조회 실패", error: error.message });
	}
}

module.exports = authController;