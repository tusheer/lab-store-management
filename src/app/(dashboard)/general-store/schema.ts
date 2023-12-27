import { zodStrng } from '@/lib/utils';
import { z } from 'zod';

export const generalStoreCreateSchema = z.object({
    type: z.enum(['machine', 'tools', 'rawmaterial', 'other', 'electronics', 'furniture', 'vehicle']).default('other'),
    name: z.string(),
    quantity: zodStrng('error'),

    purchasedAt: z.date().default(new Date()),
    brandName: z.string(),
    sellerInformation: z.string(),
    warrantyExpireDate: z.date(),
    warrantyType: z.string(),
    storageLocation: z.string(),
    intendNumber: zodStrng('error'),
    cashMemoNo: z.string(),
    cashMemoDate: z.date(),
    cashMemoImage: z
        .object({
            url: z.string(),
            key: z.string(),
        })
        .optional(),
    unitName: z.string().min(1),
    totalPrice: zodStrng('error'),
    status: z.enum(['operational', 'faulty', 'underRepair', 'disposed']).default('operational'),
    alertWhenStockAmountIsLessThan: zodStrng('error'),
    note: z.string(),
    images: z
        .array(
            z.object({
                url: z.string(),
                key: z.string(),
            })
        )
        .optional(),
});

export type GeneralStoreCreateSchema = z.infer<typeof generalStoreCreateSchema>;
