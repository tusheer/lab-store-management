import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const { email, password } = credentials ?? {};
                if (!email || !password) {
                    throw new Error('Missing username or password');
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                    select: {
                        email: true,
                        password: true,
                        id: true,
                    },
                });
                // if user doesn't exist or password doesn't match
                if (!user || !(await compare(password, user.password))) {
                    throw new Error('Invalid username or password');
                }

                return { email: user.email, id: user.id.toString() };
            },
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
