'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [, startTransition] = React.useTransition() 

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            startTransition(() => {
              toast.success('Login successful');
              redirect("/departments")
            })
        }, 3000);
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className='grid gap-2'>
                    <div className='grid gap-1'>
                        <Label className='block mb-2' htmlFor='email'>
                            Email
                        </Label>
                        <Input
                            className='mb-3'
                            id='email'
                            placeholder='Enter your email address'
                            type='email'
                            autoCapitalize='none'
                            autoComplete='email'
                            autoCorrect='off'
                            required
                            disabled={isLoading}
                        />
                        <Label className='block mb-2' htmlFor='password'>
                            Password
                        </Label>
                        <Input
                            id='password'
                            placeholder="Enter your account's password"
                            type='password'
                            autoCapitalize='none'
                            autoComplete=''
                            autoCorrect='off'
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <Button className='mt-4' disabled={isLoading}>
                        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
}
