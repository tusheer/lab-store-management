'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generalStoreCreateSchema } from '../schema';

const CreateItemForm = () => {
    const form = useForm({
        resolver: zodResolver(generalStoreCreateSchema),
    });

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex flex-col">
                    <label htmlFor="unitName">Name</label>
                    <input type="text" name="unitName" id="unitName" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="productName">Product Name</label>
                    <input type="text" name="productName" id="productName" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="stockAmount">Stock Amount</label>
                    <input type="number" name="stockAmount" id="stockAmount" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="alertWhenStockAmountIsLessThan">Alert When Stock Amount Is Less Than</label>
                    <input type="number" name="alertWhenStockAmountIsLessThan" id="alertWhenStockAmountIsLessThan" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="generalStoreNotes">General Store Notes</label>
                    <textarea name="generalStoreNotes" id="generalStoreNotes" />
                </div>
            </div>
        </div>
    );
};

export default CreateItemForm;
