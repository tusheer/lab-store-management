'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { createNewUser } from '../actions';
import { registerUserSchema } from '../schema';

export default function RegisterForm() {
    const [registerID, setRegisterID] = useState<string | null>(null);
    const form = useForm<z.infer<typeof registerUserSchema>>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            email: '',
            name: '',
            department: '',
            designation: '',
        },
    });
    const onSubmit = async (data: z.infer<typeof registerUserSchema>) => {
        try {
            const res = await createNewUser(data);

            if (res) {
                setRegisterID(res);
            }
            toast.success('Login successful');
        } catch (error) {
            toast.error('error');
        }
    };
    const handleCopy = async () => {
        if (registerID) {
            const fullPath = `${window.location.origin}/register/${registerID}`;
            navigator.clipboard.writeText(fullPath);
            toast.success('link copied');
        }
    };
    return (
        <div className={cn('grid gap-6')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your Email " {...field} />
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
                                    <Input placeholder="Enter Department name" {...field} />
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
                                    <Input placeholder="Enter Designation name" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-3">
                        <Button type="submit">
                            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{' '}
                            Submit
                        </Button>
                        {registerID ? (
                            <Button type="button" onClick={handleCopy}>
                                Copy URL
                            </Button>
                        ) : null}
                    </div>
                </form>
            </Form>
        </div>
    );
}
