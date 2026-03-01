import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
        // Keep local credentials as fallback
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // This will be handled by the existing custom login flow
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/shop/login',
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
        async jwt({ token, account, profile }) {
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            // On Google sign-in, auto-register/login user via backend
            if (account?.provider === 'google' && user.email) {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                    const tenant = process.env.NEXT_PUBLIC_TENANT_SUBDOMAIN || 'demo';

                    const res = await fetch(`${baseUrl}/auth/google-login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-tenant': tenant,
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            googleId: profile?.sub,
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        // Store token for the session
                        (user as any).backendToken = data.access_token;
                        (user as any).backendUser = data.user;
                    }
                } catch (err) {
                    console.error('Google login backend sync failed:', err);
                    // Allow sign-in even if backend sync fails
                }
            }
            return true;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'retailstore-secret-key-change-in-production',
});

export { handler as GET, handler as POST };
