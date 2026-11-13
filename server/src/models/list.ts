import { model, Schema, Types } from 'mongoose';

interface List {
    creatorId: Types.ObjectId;
    title: string;
    description: string;
    items: string[];
}

const listSchema = new Schema<List>(
    {
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            default: ""
        },
        items: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true},
);

export const ListModel = model<List>('List', listSchema);