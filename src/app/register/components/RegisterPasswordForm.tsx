'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { createPassword } from '../actions';
import { passwordSetFormSchema } from '../schema';

type RegisterPasswordFormProps = { registerID: string; email: string };

const RegisterPasswordForm: React.FC<RegisterPasswordFormProps> = ({ registerID, email }) => {
    const form = useForm<z.infer<typeof passwordSetFormSchema>>({
        resolver: zodResolver(passwordSetFormSchema),
        defaultValues: {
            password: '',
        },
    });
    const router = useRouter();
    const onSubmit = async (data: z.infer<typeof passwordSetFormSchema>) => {
        try {
            await createPassword({ password: data.password, registerID: registerID });
            toast.success('password successful set. please login again');

            // redirect('/login');
            router.push('/login');
        } catch (error) {
            toast.error('error');
        }
    };
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="Enter your Email " disabled value={email} />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
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
};

export default RegisterPasswordForm;
