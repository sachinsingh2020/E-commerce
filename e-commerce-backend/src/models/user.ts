import mongoose, { mongo } from "mongoose";
import validator from "validator";

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "user" | "admin";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    // Virtual properties
    age: number; // Virtual property
}

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please Enter Id"]
    },
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Please Enter Email"],
        validate: validator.default.isEmail
    },
    photo: {
        type: String,
        required: [true, "Please Add Photo"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please Enter Gender"]
    },
    dob: {
        type: Date,
        required: [true, "Please Enter Date of Birth"]
    }
}, {
    timestamps: true,
});

schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();

    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
})

export const User = mongoose.model<IUser>("User", schema);
