import { model, Schema, Document, Types } from "mongoose";

export interface IProfile extends Document {
    accountStatus: string;
    username: string;
    email: string;
    password?: string;

    googleId?: string;
    isGoogleAccount: boolean;
}

const profileSchema = new Schema<IProfile>(
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
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

profileSchema.pre("validate", function (next) {
    if (this.isGoogleAccount) {
        this.password = undefined; // Explicitly unset password if Google account
    }
    next();
});

export default model<IProfile>("profile", profileSchema);
