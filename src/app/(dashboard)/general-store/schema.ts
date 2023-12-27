import { z } from 'zod';

export const generalStoreCreateSchema = z.object({
    type: z.enum(['machine', 'tools', 'rawmaterial', 'other', 'electronics', 'furniture', 'vehicle']).default('other'),
    name: z.string(),
    quantity: z.number(),
    price: z.number().default(0),
    purchasedAt: z.date().default(new Date()),
    brandName: z.string(),
    sellerInformation: z.string(),
    warrantyExpireDate: z.date(),
    warrantyType: z.string(),
    storageLocation: z.string(),
    intendNumber: z.number(),
    cashMemoNo: z.string(),
    cashMemoDate: z.date(),
    cashMemoImage: z.string(),
    unitName: z.string().min(1),
    totalPrice: z.number().default(0),
    status: z.enum(['operational', 'faulty', 'underRepair', 'disposed']).default('operational'),
    alertWhenStockAmountIsLessThan: z.number().default(0),
    note: z.string(),
    images: z.array(z.string()),
});

export type GeneralStoreCreateSchema = z.infer<typeof generalStoreCreateSchema>;
