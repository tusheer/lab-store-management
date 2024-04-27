// next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            uid: string;
            name?: string;
            email?: string;
            image?: string;
            institution: {
                subdomain: string;
                id: string;
            };
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
    }

    interface JWT {
        uid?: string;
    }
}
