import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true
    },
    categories: {
        type: String,
    },
    AiPrompt : {
        type : String,
    },
    platform: String
}, {
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

export default userModel;