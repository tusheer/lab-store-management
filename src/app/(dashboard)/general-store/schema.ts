import { z } from 'zod';

export const generalStoreCreateSchema = z.object({
    type: z.enum(['machine', 'tools', 'rawmaterial', 'other', 'computer', 'furniture', 'vehicle']).default('other'),
    name: z.string(),
    quantity: z.number(),
    price: z.number().default(0),
    purchasedAt: z.date().default(new Date()),
    brandName: z.string(),
    sellerInformation: z.string(),
    warrantyExpireDate: z.date(),
    warrantyType: z.string(),
    userId: z.string().min(1),
    storageLocation: z.string(),
    intendNumber: z.string(),
    cashMemoNo: z.string(),
    cashMemoDate: z.date(),
    cashMemoImage: z.string(),
    unitName: z.string().min(1),
    totalPrice: z.number().default(0),
    status: z.enum(['active', 'faulty', 'underRepair', 'disposed']).default('active'),
    alertWhenStockAmountIsLessThan: z.number().default(0),
});

export type GeneralStoreCreateSchema = z.infer<typeof generalStoreCreateSchema>;
