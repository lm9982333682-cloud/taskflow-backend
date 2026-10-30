import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generatorToken, cookieOption, verifyRefreshToken, } from '../utils/authUtil.js'
import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);





const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const checkEmal = await User.findOne({ email });
        if (checkEmal) {
            return res.status(409).json({
                success: false,
                message: "Email id already exists",

            })
        };

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hash })



        res.status(201).json({
            success: true,
            message: "User Register Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
            },
        })

    } catch (err) {


        console.log("Register Error:-", err);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            err,
        })
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive",
            });
        }

        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "Please use Google login for this account",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        const { accessToken, refreshToken, } = generatorToken(user);

        res.cookie("refreshToken", refreshToken, cookieOption)


        await User.findByIdAndUpdate(user._id, {
            refreshToken,
            lastLogin: new Date,
        })


        return res.status(200).json({
            success: true,
            message: "User Login successful",

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};


const refresh = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresk Token Not Found"
            })
        }

        const { id } = verifyRefreshToken(refreshToken);

        const user = await User.findById(id);

        if (!user) {
            res.clearCookie("refreshToken", cookieOption);

            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }



        if (user.refreshToken !== refreshToken) {
            await User.findByIdAndUpdate(user._id, {
                refreshToken: null,
            });

            res.clearCookie("refreshToken", cookieOption);
            return res.status(401).json({
                success: false,
                message: "Refresk Token dose not match"
            })
        }



        const { accessToken, refreshToken: newRefreshToken, } = generatorToken(user);

        res.cookie("refreshToken", newRefreshToken, cookieOption)


        await User.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken,
        })


        return res.status(200).json({
            success: true,
            message: "Refresh successful",

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Refresh error:", error);

        res.clearCookie("refreshToken", cookieOption);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error("GetMe error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.clearCookie("refreshToken", cookieOption);

            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await User.findByIdAndUpdate(user._id, {
            refreshToken: null,
        });

        res.clearCookie("refreshToken", cookieOption);

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });


    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email || !payload.email_verified) {
            return res.status(401).json({
                success: false,
                message: "Google account email is not verified",
            });
        }

        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({
            $or: [{ googleId }, { email }],
        });

        if (user && !user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive",
            });
        }

        if (user) {
            if (user.googleId && user.googleId !== googleId) {
                return res.status(409).json({
                    success: false,
                    message: "Google account does not match",
                });
            }

            if (!user.googleId) {
                user.googleId = googleId;
            }

            if (!user.avatar && picture) {
                user.avatar = picture;
            }

            await user.save();
        } else {
            user = await User.create({
                name: name || email.split("@")[0],
                email,
                googleId,
                avatar: picture || "",
                isEmailVerified: true,
            });
        }

        const { accessToken, refreshToken } = generatorToken(user);

        await User.findByIdAndUpdate(user._id, {
            refreshToken,
            lastLogin: new Date(),
        });

        res.cookie("refreshToken", refreshToken, cookieOption);

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error("Google login error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Google authentication failed",
        });
    }
};

export default {
    register, login, refresh, getMe, logout, googleLogin
}