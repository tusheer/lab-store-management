'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginSchecma } from '../schema';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({}: UserAuthFormProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchecma>>({
        resolver: zodResolver(loginSchecma),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = async (data: z.infer<typeof loginSchecma>) => {
        const { email, password } = data;

        try {
            const response = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
                callbackUrl: '/departments',
            });

            if (response?.error) {
                toast.error("Couldn't login");
                return;
            }
            router.push('/departments');
        } catch (error) {
            toast.error("Couldn't login");
        }
    };

    return (
        <div className={cn('grid gap-3')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password " type="password" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">
                        {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}
