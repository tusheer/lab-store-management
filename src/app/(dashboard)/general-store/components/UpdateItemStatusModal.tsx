'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateStoreItemStatus } from '../actions';
import { UpdateStoreItemStatusSchemaType, updateStoreItemStatusSchema } from '../schema';

type UpdateItemStatusModalProps = {
    isOpen: boolean;
    onClose: () => void;
    data: UpdateStoreItemStatusSchemaType & { itemId: number; name: string };
};

const UpdateItemStatusModal: React.FC<UpdateItemStatusModalProps> = ({ data, isOpen, onClose }) => {
    const form = useForm<UpdateStoreItemStatusSchemaType>({
        defaultValues: {
            status: data.status,
            name: data.name,
        },
        resolver: zodResolver(updateStoreItemStatusSchema),
    });

    const router = useRouter();

    const onSubmit = async (formData: UpdateStoreItemStatusSchemaType) => {
        try {
            if (data.itemId === undefined) throw new Error('Store id is not defined');

            await updateStoreItemStatus(data.itemId, formData);
            onClose();
            form.reset();
            router.refresh();
            toast.success('Updated successful');
        } catch (error) {
            toast.error('error');
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <h4 className="text-lg font-semibold">
                            Update status for item <span className="font-normal">{data.name}</span>
                        </h4>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="mt-2.5">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Select status</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        <SelectItem value="operational">Operational</SelectItem>
                                                        <SelectItem value="faulty">Faulty</SelectItem>
                                                        <SelectItem value="underRepair">Under Repair</SelectItem>
                                                        <SelectItem value="disposed">Disposed</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="mt-5">
                            <Button variant="outline" type="button" onClick={() => onClose()}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateItemStatusModal;
