import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "@/lib/prisma-client"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, _req) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };
                const user = await prisma.user.findFirst({
                    where: {
                        email,
                    },
                })

                if (!user) {
                    throw new Error("Không tìm thấy email của bạn");
                }

                if (password !== user.password) {
                    throw new Error("Mật khẩu của bạn không chính xác");
                }

                return {
                    id: user.id as string,
                    email: user.email as string,
                    name: user.name as string,
                    image: JSON.stringify({ image: user.image as string, isAdmin: user.isAdmin }),
                }
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.uid;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin",
        error: '/signin',
    }
};

export default NextAuth(authOptions);
