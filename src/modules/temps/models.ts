import { model, Schema, Document, Types } from "mongoose";

export interface ITemp extends Document {
    temp: string;
}

const tempSchema = new Schema<ITemp>(
    {
        temp: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default model<ITemp>("temp", tempSchema);
