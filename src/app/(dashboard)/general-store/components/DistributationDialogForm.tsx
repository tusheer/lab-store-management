'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import useFileUpload from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { addNewDistributionToGeneralStore } from '../actions';
import { DistributionCreateSchemaType, distributionCreateFormSchema } from '../schema';

type DistributationDialogFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: {
        storeId: number;
        name: string;
        unitName: string;
        stock: number;
    };
};

const DistributationDialogForm: React.FC<DistributationDialogFormProps> = ({ data, open, setOpen }) => {
    const router = useRouter();
    const form = useForm<DistributionCreateSchemaType>({
        resolver: zodResolver(distributionCreateFormSchema),
        defaultValues: {
            department: '',
            shopName: '',
            personName: '',
            quantity: '',
            allocatedAt: new Date(),
            name: data.name,
            storeId: data.storeId,
            unitName: data.unitName,
            note: '',
            stock: data.stock,
        },
    });

    const { files, onChange, onUpload, onRemove } = useFileUpload({
        endpoint: 'imageUploader',
        previousUploadedFiles: [],
        multiple: true,
    });

    const handleSubmit = async (data: DistributionCreateSchemaType) => {
        try {
            const files = await onUpload();
            await addNewDistributionToGeneralStore(
                {
                    ...data,
                    images: files.map((file) => ({ url: file.url, key: file.key })),
                },
                data.storeId
            );
            form.reset();
            toast.success('Create successfully');
            router.refresh();
            setOpen(false);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-xl pb-6">
                    <DrawerHeader className="px-0">
                        <DrawerTitle>
                            Add Distributation for <span className="text-primary">{data.name}</span>
                        </DrawerTitle>
                    </DrawerHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="max-h-[calc(100vh-100px)] w-full space-y-3 overflow-auto"
                        >
                            <div className="flex w-full gap-3">
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
                                            <FormLabel>Department name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter department name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shopName"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
                                            <FormLabel>Shop/Lab name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Shop/Lab name " {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex w-full gap-3">
                                <FormField
                                    control={form.control}
                                    name="personName"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
                                            <FormLabel>Person name*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter person name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
                                            <FormLabel> Quantity*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter quantity" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="allocatedAt"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Distributation date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? (
                                                            format(field.value, 'PPP')
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(e) => field.onChange(e)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                            <div>
                                <FormLabel className="mb-3 block">Images</FormLabel>
                                <Input
                                    type="file"
                                    onChange={onChange}
                                    multiple={true}
                                    accept="image/*"
                                    placeholder="Type your note here."
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {files.map((file, index) => (
                                    <div className="relative aspect-square  h-20 w-20  rounded border" key={file.uid}>
                                        <button
                                            onClick={() => onRemove(index)}
                                            className="absolute -right-2 -top-2 rounded-full border bg-gray-50 p-0.5"
                                        >
                                            <X className="h-4 w-4 text-gray-800" />
                                        </button>
                                        <img className="object-cover" src={file.url} alt="" />
                                    </div>
                                ))}
                            </div>
                            <Button type="submit">
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default DistributationDialogForm;
