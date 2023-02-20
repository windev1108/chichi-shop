import { File } from '@/utils/types';
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: User;
    }

    interface User {
        id: string;
        name: string;
        email: string;
        isAdmin?: boolean
        image?: string;
    }
}
