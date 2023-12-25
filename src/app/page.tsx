import { Input } from '@/components/ui/input';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function Home() {
    const res = await prisma?.user.findMany({
        select: {
            email: true,
            id: true,
        },
    });

    async function onSubmit(formData: FormData) {
        'use server';
        await prisma.user.create({
            data: {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                name: 'test',
            },
        });

        revalidatePath('/');
    }

    return (
        <>
            <div>
                {res.map((user) => (
                    <div key={user.id}> {user.email} </div>
                ))}
            </div>
            <div>
                <form action={onSubmit}>
                    <Input type="email" name="email" />
                    <Input type="password" name="password" />
                    <button type="submit">Create</button>
                </form>
            </div>
        </>
    );
}
