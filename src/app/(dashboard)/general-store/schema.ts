import { zodStrng } from '@/lib/utils';
import { z } from 'zod';

export const generalStoreCreateSchema = z
    .object({
        type: z
            .enum(['machine', 'tools', 'rawmaterial', 'other', 'electronics', 'furniture', 'vehicle'])
            .default('other'),
        name: z.string(),
        quantity: zodStrng('error'),
        purchasedAt: z.date().default(new Date()),
        brandName: z.string().optional(),
        sellerInformation: z.string().optional(),
        warrantyExpireDate: z.date().optional(),
        warrantyType: z.string().optional(),
        storageLocation: z.string().optional(),
        indentNo: zodStrng('error'),
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
    })
    .refine(
        (data) => {
            if (data.sourceType === 'purchase') {
                return data.totalPrice !== undefined;
            }
            return true;
        },
        {
            message: 'Total price is required for purchase type',
            path: ['totalPrice'],
        }
    );

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

export const distributionCreateFormSchema = z
    .object({
        storeId: z.number(),
        personName: z.string().min(1),
        department: z.string().min(1),
        name: z.string().min(1),
        shopName: z.string().optional(),
        note: z.string().optional(),
        images: z
            .array(
                z.object({
                    key: z.string(),
                    url: z.string(),
                })
            )
            .optional(),
        quantity: zodStrng('Quantity requred')
            .refine((data) => data !== '', {
                message: 'Quantity requred',
            })
            .refine((data) => data.toString() !== '0', {
                message: 'The quantity should be greater than 0',
            }),
        unitName: z.string(),
        allocatedAt: z.date(),
        stock: z.number(),
        indentNo: zodStrng('error'),
    })
    .refine(
        (data) => {
            return data.stock >= Number(data.quantity);
        },
        {
            message: 'Quantity must be less than or equal to stock',
            path: ['quantity'],
        }
    );

export const sourceCreateSchema = z
    .object({
        name: z.string().min(1),
        storeId: z.number(),
        quantity: zodStrng('error'),
        purchasedAt: z.date().default(new Date()),
        brandName: z.string().optional(),
        sellerInformation: z.string().optional(),
        warrantyExpireDate: z.date().optional(),
        warrantyType: z.string().optional(),
        indentNo: zodStrng('error'),
        cashMemoNo: z.string().optional(),
        unitName: z.string().min(1),
        stock: z.number(),
        cashMemoDate: z.date().optional(),
        sourceType: z.enum(['purchase', 'donation', 'others', 'restock']),
        cashMemoImage: z
            .object({
                url: z.string(),
                key: z.string(),
            })
            .optional(),
        totalPrice: zodStrng('error').optional(),
        status: z.enum(['operational', 'faulty', 'underRepair', 'disposed']).default('operational').optional(),
        note: z.string().optional(),
        images: z
            .array(
                z.object({
                    url: z.string(),
                    key: z.string(),
                })
            )
            .optional(),
    })
    .refine(
        (data) => {
            if (data.sourceType === 'purchase') {
                return data.totalPrice !== undefined;
            }
            return true;
        },
        {
            message: 'Total price is required for purchase type',
            path: ['totalPrice'],
        }
    );

export const noteCreateSchema = z.object({
    note: z.string().min(1),
    images: z
        .array(
            z.object({
                url: z.string(),
                key: z.string(),
            })
        )
        .optional(),
});

export type NoteCreateSchemaType = z.infer<typeof noteCreateSchema>;

export type SourceCreateSchemaType = z.infer<typeof sourceCreateSchema>;

export type DistributionCreateSchemaType = z.infer<typeof distributionCreateFormSchema>;

export type FinancialYearCreateSchema = z.infer<typeof financialYearCreateSchema>;

export type GeneralStoreCreateSchema = z.infer<typeof generalStoreCreateSchema>;
