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
