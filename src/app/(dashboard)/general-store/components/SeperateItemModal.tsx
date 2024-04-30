'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useFileUpload from '@/hooks/useFileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { separateStoreItem } from '../actions';
import { SeparateItemSchemaType, separateItemSchema } from '../schema';

type SeparateItemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    data: { itemId: number; stock: number };
};

const SeperateItemModal: React.FC<SeparateItemModalProps> = ({ isOpen, onClose, data }) => {
    const form = useForm<SeparateItemSchemaType>({
        defaultValues: {
            note: '',
            quantity: '',
            location: '',
            status: 'operational',
            stock: data.stock,
            images: [],
        },
        resolver: zodResolver(separateItemSchema),
    });

    const router = useRouter();

    const {
        files: noteFiles,
        onChange: noteOnChanage,
        onUpload: noteOnUpload,
        onRemove: noteOnRemove,
    } = useFileUpload({
        endpoint: 'imageUploader',
        previousUploadedFiles: [],
        multiple: true,
    });

    const onSubmit = async (formData: SeparateItemSchemaType) => {
        try {
            if (data.itemId === undefined) throw new Error('Store id is not defined');

            const noteImages = await noteOnUpload();
            await separateStoreItem(
                {
                    location: formData.location,
                    note: formData.note,
                    quantity: Number(formData.quantity),
                    status: formData.status,
                    stock: formData.stock,
                    images: noteImages.map((file) => ({ url: file.url, key: file.key })),
                    indentNo: formData.indentNo,
                    brandName: formData.brandName,
                },
                data.itemId
            );

            onClose();
            form.reset();
            router.refresh();

            toast.success('Created successful');
        } catch (error) {
            toast.error('error');
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <h4 className="text-lg font-semibold">Separate Item</h4>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Type your quantity here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-2.5">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type your location here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mt-2.5">
                            <FormField
                                control={form.control}
                                name="brandName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Brand Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type your brand name here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-2.5">
                            <FormField
                                control={form.control}
                                name="indentNo"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Indent No</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type your indent no here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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

                        <div className="mt-2.5">
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your note here." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-2.5">
                            <FormLabel className="mb-3 block">Images</FormLabel>
                            <Input
                                type="file"
                                onChange={noteOnChanage}
                                multiple={true}
                                accept="image/*"
                                placeholder="Type your note here."
                            />
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-3">
                            {noteFiles.map((file, index) => (
                                <div className="relative aspect-square  h-20 w-20  rounded border" key={file.uid}>
                                    <button
                                        onClick={() => noteOnRemove(index)}
                                        className="absolute -right-2 -top-2 rounded-full border bg-gray-50 p-0.5"
                                    >
                                        <X className="h-4 w-4 text-gray-800" />
                                    </button>
                                    <img className="object-cover" src={file.url} alt="" />
                                </div>
                            ))}
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

export default SeperateItemModal;
