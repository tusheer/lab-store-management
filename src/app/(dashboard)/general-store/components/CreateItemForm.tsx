'use client';

import PageHeading from '@/components/ui/PageHeading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createNewGeneralStoreItem } from '../actions';
import { GeneralStoreCreateSchema, generalStoreCreateSchema } from '../schema';

const CreateItemForm = () => {
    const form = useForm<GeneralStoreCreateSchema>({
        resolver: zodResolver(generalStoreCreateSchema),
    });

    const router = useRouter();

    const {
        onChange,
        onUpload: onCashmemoImageUpload,
        onRemove: onCashmemoRemove,
        files: cashmemoFiles,
    } = useFileUpload({
        endpoint: 'imageUploader',
        previousUploadedFiles: [],
        multiple: false,
    });

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

    const [selectedSourceType, setSelectedSourceType] = useState('');

    const onSubmit = async (data: GeneralStoreCreateSchema) => {
        try {
            const cashMemoImages = await onCashmemoImageUpload();
            const noteImages = await noteOnUpload();

            const resposen = await createNewGeneralStoreItem({
                ...data,
                quantity: Number(data.quantity),
                totalPrice: data.totalPrice,
                indentNo: data.indentNo,
                cashMemoImage: cashMemoImages[0]
                    ? {
                          key: cashMemoImages[0].key,
                          url: cashMemoImages[0].url,
                      }
                    : undefined,
                images: noteImages.map((file) => ({ url: file.url, key: file.key })),
            });

            router.push(`/general-store?recentUpdated=${resposen.id}`);
            toast.success('Created successful');
        } catch (error) {
            toast.error('error');
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="mb-5">
                <PageHeading title={`Create general store item `} />
            </div>
            <Form {...form}>
                <form className="w-full space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex w-full flex-col gap-3 lg:flex-row">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12 lg:w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unitName"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12 lg:w-full">
                                    <FormLabel>Unit name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your unit name " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex w-full flex-col gap-3 lg:flex-row">
                        <FormField
                            control={form.control}
                            name="brandName"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Brand Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Brand  name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel> Quantity</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter quantity" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-3 lg:flex-row">
                        <FormField
                            control={form.control}
                            name="storageLocation"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Storage location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter storage location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="indentNo"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Indent number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter indent Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex w-full flex-col gap-3 lg:flex-row">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Select Type</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Departments</SelectLabel>
                                                    <SelectItem value="machine">Machine</SelectItem>
                                                    <SelectItem value="tools">Tools</SelectItem>
                                                    <SelectItem value="rawmaterial">Raw material</SelectItem>
                                                    <SelectItem value="electronics">Electronics</SelectItem>
                                                    <SelectItem value="furniture">Furniture</SelectItem>
                                                    <SelectItem value="vehicle">Vehicle</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Select status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(e) => field.onChange(e)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Departments</SelectLabel>
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
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <FormField
                            control={form.control}
                            name="alertWhenStockAmountIsLessThan"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Alert when stock amount is less than </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter number value" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sourceType"
                            render={({ field }) => (
                                <FormItem className="w-full lg:w-6/12">
                                    <FormLabel>Select source type</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(e) => {
                                                field.onChange(e);
                                                setSelectedSourceType(e);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select source type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Source source type</SelectLabel>
                                                    <SelectItem value="purchase">Purchase</SelectItem>
                                                    <SelectItem value="donation">Donation</SelectItem>
                                                    <SelectItem value="others">Others</SelectItem>
                                                    <SelectItem value="restock">Restock</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
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

                    <div>
                        <FormLabel className="mb-3 block">Images</FormLabel>
                        <Input
                            type="file"
                            onChange={noteOnChanage}
                            multiple={true}
                            accept="image/*"
                            placeholder="Type your note here."
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
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

                    {selectedSourceType === 'purchase' && (
                        <div className="w-full space-y-3">
                            <div className="flex w-full flex-col gap-3 lg:flex-row">
                                <FormField
                                    control={form.control}
                                    name="totalPrice"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:w-6/12">
                                            <FormLabel> Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter total Price" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="purchasedAt"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:w-6/12">
                                            <FormLabel className="mb-2 block"> Purchased At</FormLabel>
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
                                                    <PopoverContent className="w-full p-0">
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
                            </div>

                            <div className="flex w-full flex-col gap-3 lg:flex-row">
                                <FormField
                                    control={form.control}
                                    name="warrantyExpireDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:w-6/12">
                                            <FormLabel>Warranty expire date</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger className='className="w-full lg:w-6/12"' asChild>
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
                                                    <PopoverContent className="w-full p-0">
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
                                    name="warrantyType"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:w-6/12">
                                            <FormLabel>Warranty type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter warranty Type" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-3 lg:flex-row">
                                <FormField
                                    control={form.control}
                                    name="cashMemoNo"
                                    render={({ field }) => (
                                        <FormItem className="w-full lg:w-6/12">
                                            <FormLabel>Cashmemo number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter cash Memo No" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="w-full space-y-3 lg:w-6/12">
                                    <FormLabel className="mt-1 block" htmlFor="cashmemo_iamge">
                                        Cashmemo image
                                    </FormLabel>
                                    <Input
                                        onChange={onChange}
                                        id="cashmemo_iamge"
                                        type="file"
                                        accept="image/*"
                                        multiple={false}
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        {cashmemoFiles.map((file, index) => (
                                            <div
                                                className="relative aspect-square  h-20 w-20  rounded border"
                                                key={file.uid}
                                            >
                                                <button
                                                    onClick={() => onCashmemoRemove(index)}
                                                    className="absolute -right-2 -top-2 rounded-full border bg-gray-50 p-0.5"
                                                >
                                                    <X className="h-4 w-4 text-gray-800" />
                                                </button>
                                                <img className="object-cover" src={file.url} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-3 lg:flex-row">
                                <FormField
                                    control={form.control}
                                    name="cashMemoDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Cashmemo date</FormLabel>
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
                            </div>
                            <div className="flex gap-3 ">
                                <FormField
                                    control={form.control}
                                    name="sellerInformation"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Seller information</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter seller Information" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <Button type="submit">
                        {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CreateItemForm;
