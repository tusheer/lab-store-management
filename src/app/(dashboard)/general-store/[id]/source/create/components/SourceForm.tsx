'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { addNewSourceToGeneralStore } from '../../../../actions';
import { SourceCreateSchemaType, sourceCreateSchema } from '../../../../schema';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

type DistributionFormProps = {
    data: {
        storeId: number;
        name: string;
        unitName: string;
        stock: number;
    };
};

const SourceForm: React.FC<DistributionFormProps> = ({ data }) => {
    const router = useRouter();
    const form = useForm<SourceCreateSchemaType>({
        resolver: zodResolver(sourceCreateSchema),
        defaultValues: {
            brandName: '',
            quantity: '',
            name: data.name,
            storeId: data.storeId,
            unitName: data.unitName,
            note: '',
            stock: data.stock,
            cashMemoNo: '',
            sellerInformation: '',
            totalPrice: '',
            warrantyType: '',
            indentNo: '',
        },
    });

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

    const handleSubmit = async (data: SourceCreateSchemaType) => {
        try {
            const cashMemoImages = await onCashmemoImageUpload();
            const noteImages = await noteOnUpload();

            await addNewSourceToGeneralStore({
                ...data,
                cashMemoImage: cashMemoImages[0]
                    ? {
                          key: cashMemoImages[0].key,
                          url: cashMemoImages[0].url,
                      }
                    : undefined,
                images: noteImages.map((file) => ({ url: file.url, key: file.key })),
            });

            toast.success('Create successfully');
            router.push(`/general-store?recentUpdated=${data.storeId}`);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };
    return (
        <div className="mt-6 w-full max-w-2xl pb-6">
            <Form {...form}>
                <form className="w-full space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex w-full gap-3">
                        <FormField
                            control={form.control}
                            name="brandName"
                            render={({ field }) => (
                                <FormItem className="w-6/12">
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
                                <FormItem className="w-6/12">
                                    <FormLabel> Quantity</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter quantity" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex w-full gap-3">
                        <FormField
                            control={form.control}
                            name="indentNo"
                            render={({ field }) => (
                                <FormItem className="w-6/12">
                                    <FormLabel>Indent number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Indent number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sourceType"
                            render={({ field }) => (
                                <FormItem className="w-6/12">
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
                            <div className="flex w-full gap-3">
                                <FormField
                                    control={form.control}
                                    name="totalPrice"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
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
                                        <FormItem className="w-6/12">
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

                            <div className="flex w-full gap-3">
                                <FormField
                                    control={form.control}
                                    name="warrantyExpireDate"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
                                            <FormLabel>Warranty expire date</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger className='className="w-6/12"' asChild>
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
                                        <FormItem className="w-6/12">
                                            <FormLabel>Warranty type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter warranty Type" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-3">
                                <FormField
                                    control={form.control}
                                    name="cashMemoNo"
                                    render={({ field }) => (
                                        <FormItem className="w-6/12">
                                            <FormLabel>Cashmemo number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter cash Memo No" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="w-6/12 space-y-3">
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

                            <div className="flex w-full gap-3">
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

export default SourceForm;
