'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useFileUpload from '@/hooks/useFileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateProfile } from '../action';
import { Profile } from '../page';
import { UpdateUserSchema, updateUserSchema } from '../schema';

type UpdateProfileComponentProps = {
    data: NonNullable<Profile>;
};

const UpdateProfileComponent: React.FC<UpdateProfileComponentProps> = ({ data }) => {
    const session = useSession();

    const form = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: data.name || '',
            email: data.email,
            address: data?.address || '',
            department: data?.department || '',
            designation: data?.designation || '',
            phone: data?.phone || '',
        },
    });
    const image = useMemo(() => {
        if (data?.avatar === null) return [];

        const image = data?.avatar as { key: string; url: string };

        return [
            {
                name: 'avatar',
                url: image.url || '',
                uid: '1',
                key: image.key,
            },
        ];
    }, [data?.avatar]);

    const { files, onChange, onUpload } = useFileUpload({
        endpoint: 'imageUploader',
        previousUploadedFiles: image,
        multiple: false,
    });

    const handleSubmit = async (data: UpdateUserSchema) => {
        const files = await onUpload();

        const respnse = await updateProfile({
            ...data,
            avatar: {
                key: files[0]?.key,
                url: files[0]?.url,
            },
        });

        if (respnse === null) return;

        const avatar = files[0]?.url || null;

        await session.update({
            name: respnse.name,
            email: respnse.email,
            avatar: avatar,
            id: respnse.id,
        });

        toast.success('Profile updated successfully');
    };

    return (
        <div className="mx-auto mt-6 max-w-lg">
            <h1 className="mb-6 text-xl font-semibold text-gray-900">Update profile</h1>
            <div className="relative h-32 w-32  cursor-pointer">
                <Avatar className="h-32 w-32 flex-shrink-0 border ">
                    <AvatarImage src={files[0]?.url || ''} />
                    <AvatarFallback className="text-lg">
                        {data?.name
                            ?.split(' ')
                            .map((name: string) => name[0])
                            .join('')}
                    </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-white">
                    <span className="sr-only">Change image</span>
                    <Plus className="h-5 w-5" />
                </button>
                <input
                    onChange={onChange}
                    multiple={false}
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    type="file"
                />
            </div>
            <Form {...form}>
                <form className="mt-6 space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={true} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your valid phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your department name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your department name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adress</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">
                        {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Update
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UpdateProfileComponent;
