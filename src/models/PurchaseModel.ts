import mongoose from 'mongoose';
import { SchemaTimestampsConfig } from './types';

export type PurchaseEntry = mongoose.Document &
    SchemaTimestampsConfig & {
        name: string;
        number: number;
        bought: boolean;
    };

const purchaseSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true },
        number: { type: Number, default: 1 },
        bought: { type: Boolean, default: false },
        list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
    },
    { timestamps: true },
);

export const PurchaseModel = mongoose.model<PurchaseEntry>(
    'Purchase',
    purchaseSchema,
);
