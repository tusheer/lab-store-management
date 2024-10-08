'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { roleBasedRedirect } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginSchecma } from '../schema';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({}: UserAuthFormProps) {
    const router = useRouter();
    const { data: session } = useSession();

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
                callbackUrl: '/login',
            });

            if (response?.error) {
                toast.error("Couldn't login");
                return;
            }
            // Get user role from the response (you may need to fetch it from the backend if not included in the response)
            const userResponse = await fetch('/api/auth/session').then((res) => res.json());
            toast.success('Logged in successfully');
            if (userResponse?.user?.role) {
                const redirectUrl = roleBasedRedirect(userResponse.user.role);
                router.push(redirectUrl);
            } else {
                // Default redirect if no role is found
                router.push('/');
            }
        } catch (error) {
            toast.error("Couldn't login");
        }
    };

    return (
        <div className={cn('grid gap-3 px-5 lg:px-0')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email*</FormLabel>
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
                                <FormLabel>Password*</FormLabel>
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
