import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const { data: user, error } = await supabase
                    .from("students")
                    .select("*")
                    .eq("email", credentials.email)
                    .single();

                if (error || !user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password_hash);
                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.full_name,
                    email: user.email,
                    batchId: user.batch_id,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.batchId = (user as any).batchId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).batchId = token.batchId;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "default_development_secret",
});

export { handler as GET, handler as POST };
