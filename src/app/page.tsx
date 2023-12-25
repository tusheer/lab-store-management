import { Input } from '@/components/ui/input';
import prisma from '@/lib/prisma';

export default async function Home() {
    const res = await prisma?.user.findMany({
        select: {
            email: true,
            id: true,
        },
    });

    return (
        <>
            <div>
                {res.map((user) => (
                    <div key={user.id}> {user.email} </div>
                ))}
            </div>
            <div>
                <form>
                    <Input type="email" name="email" />
                    <Input type="password" name="password" />
                    <button type="submit">Create</button>
                </form>
            </div>
        </>
    );
}
