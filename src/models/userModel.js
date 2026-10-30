import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },

    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },


    googleId: {
        type: String,
        unique: true,
        sparse: true,
        select: false,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    lastLogin: {
        type: Date,
        default: null,
    },

    refreshToken: {
        type: String,
    }



}, { timestamps: true });


const User = mongoose.model("User", userSchema);

export default User;
