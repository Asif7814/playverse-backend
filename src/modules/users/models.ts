import { model, Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
    accountStatus: string;
    username: string;
    email: string;
    password?: string;

    googleId?: string;
    isGoogleAccount: boolean;

    deactivationDate?: Date;
}

const userSchema = new Schema<IUser>(
    {
        // AUTHENTICATION FIELDS
        accountStatus: {
            type: String,
            required: true,
            enum: ["pending", "active", "deactivated"],
            default: "pending",
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.isGoogleAccount;
            },
        },

        // OAUTH FIELDS
        googleId: {
            type: String,
        },
        isGoogleAccount: {
            type: Boolean,
            required: true,
            default: false,
        },

        // SPECIAL FIELDS
        // cron job will check this to delete account after 30 days
        deactivationDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

userSchema.pre("validate", function (next) {
    if (this.isGoogleAccount) {
        this.password = undefined; // Explicitly unset password if Google account
    }
    next();
});

export default model<IUser>("user", userSchema);
