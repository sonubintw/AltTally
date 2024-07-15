import mongoose, { CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from 'bcrypt';



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "please enter valid email"]

    },
    password: {
        type: String,
        required: true,
        minLength: [6, "password must be upto 6 char"],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},
    { timestamps: true }
)


// Hash the password before saving it to the database
userSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error: unknown | any) {
        return next(error);
    }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password: any) {
    return bcrypt.compare(password, this.password);
};

const User: any = mongoose.model('User', userSchema);

export = User