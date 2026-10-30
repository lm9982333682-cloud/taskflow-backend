import jwt from "jsonwebtoken";
import config from "../config/config.js";



const generatorToken = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken }


};





const cookieOption = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};



const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
}

export { generatorToken, cookieOption, verifyRefreshToken, verifyAccessToken, }


