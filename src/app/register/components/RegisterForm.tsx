'use client';

import { Button } from '@/components/ui/button';
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
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                                    <Select onValueChange={(e) => field.onChange(e)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Departments</SelectLabel>
                                                <SelectItem value="Mechanical Technology">
                                                    Mechanical Technology
                                                </SelectItem>
                                                <SelectItem value="Civil Technology">Civil Technology</SelectItem>
                                                <SelectItem value="Electrical Technology">
                                                    Electrical Technology
                                                </SelectItem>
                                                <SelectItem value="Electronics Technology">
                                                    Electronics Technology
                                                </SelectItem>
                                                <SelectItem value="Power Technology">Power Technology</SelectItem>
                                                <SelectItem value="Computer Technology">Computer Technology</SelectItem>
                                                <SelectItem value="Non Tech">Non Tech</SelectItem>
                                                <SelectItem value="Account Section">Account Section</SelectItem>
                                                <SelectItem value="Library">Library</SelectItem>
                                                <SelectItem value="Academic Department">Academic Department</SelectItem>
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
