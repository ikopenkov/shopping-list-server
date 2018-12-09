import mongoose from 'mongoose';
import { SchemaTimestampsConfig } from './types';
import { PurchaseEntry } from './PurchaseModel';

export type ListEntry = mongoose.Document &
    SchemaTimestampsConfig & {
        name: string;
        purchases: PurchaseEntry[];
    };

const listSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, default: '' },
        purchases: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Purchase',
            },
        ],
    },
    { timestamps: true },
);

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
// export const ListModel: ListEntry = mongoose.model<ListEntry>('List', listSchema);
export const ListModel = mongoose.model<ListEntry>('List', listSchema);
