import { zodStrng } from '@/lib/utils';
import { z } from 'zod';

export const generalStoreCreateSchema = z.object({
    type: z.enum(['machine', 'tools', 'rawmaterial', 'other', 'electronics', 'furniture', 'vehicle']).default('other'),
    name: z.string(),
    quantity: zodStrng('error'),
    purchasedAt: z.date().default(new Date()),
    brandName: z.string().optional(),
    sellerInformation: z.string().optional(),
    warrantyExpireDate: z.date().optional(),
    warrantyType: z.string().optional(),
    storageLocation: z.string().optional(),
    intendNumber: zodStrng('error'),
    cashMemoNo: z.string().optional(),
    cashMemoDate: z.date().optional(),
    sourceType: z.enum(['purchase', 'donation', 'others', 'restock']),
    cashMemoImage: z
        .object({
            url: z.string(),
            key: z.string(),
        })
        .optional(),
    unitName: z.string().min(1),
    totalPrice: zodStrng('error').optional(),
    status: z.enum(['operational', 'faulty', 'underRepair', 'disposed']).default('operational').optional(),
    alertWhenStockAmountIsLessThan: zodStrng('error'),
    note: z.string().optional(),
    images: z
        .array(
            z.object({
                url: z.string(),
                key: z.string(),
            })
        )
        .optional(),
});

export const financialYearCreateSchema = z.object({
    name: z.string(),
    date: z.array(z.date().or(z.undefined()), z.date().or(z.undefined())).refine(
        (data) => {
            const [firstDate, secondDate] = data;
            // Check if one of the dates is null and the other is not
            if (
                (firstDate === undefined && secondDate !== undefined) ||
                (firstDate !== undefined && secondDate === undefined)
            ) {
                return false;
            }
            return true;
        },
        {
            message: 'Start date and end date must be required',
        }
    ),
});

export type FinancialYearCreateSchema = z.infer<typeof financialYearCreateSchema>;

export type GeneralStoreCreateSchema = z.infer<typeof generalStoreCreateSchema>;
