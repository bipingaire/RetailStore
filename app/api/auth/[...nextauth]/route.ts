import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as dotenv from 'dotenv';
import path from 'path';

// Explicitly load credentials from .env.production
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

import { NextRequest } from 'next/server';

const authOptions = {
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
        async signIn({ user, account, profile }: any) {
            if (account?.provider === 'google' && user?.email) {
                try {
                    const baseUrl = process.env.BACKEND_INTERNAL_URL
                        ? process.env.BACKEND_INTERNAL_URL.replace(/\/api\/?$/, '') + '/api'
                        : 'http://backend:3001/api';

                    const authUrl = process.env.NEXTAUTH_URL || '';
                    const tenantMatch = authUrl.match(/^https?:\/\/([^.]+)\./);
                    const tenant = (tenantMatch && tenantMatch[1] !== 'www') 
                        ? tenantMatch[1] 
                        : (process.env.NEXT_PUBLIC_TENANT_SUBDOMAIN || 'demo');

                    // Pre-flight check: attempt login to see if user exists
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

                    if (!res.ok) {
                        return `/shop/login?error=user_does_not_exist`;
                    }
                } catch (err) {
                    console.error('[NextAuth] signIn error:', err);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account, profile }: any) {
            if (account) {
                token.provider = account.provider;
            }

            // On first Google sign-in (account is populated), sync with backend
            if (account?.provider === 'google' && user?.email) {
                try {
                    const baseUrl = process.env.BACKEND_INTERNAL_URL
                        ? process.env.BACKEND_INTERNAL_URL.replace(/\/api\/?$/, '') + '/api'
                        : 'http://backend:3001/api';

                    // Parse tenant from NEXTAUTH_URL (set dynamically per-request)
                    const authUrl = process.env.NEXTAUTH_URL || '';
                    const tenantMatch = authUrl.match(/^https?:\/\/([^.]+)\./);
                    const tenant = (tenantMatch && tenantMatch[1] !== 'www') 
                        ? tenantMatch[1] 
                        : (process.env.NEXT_PUBLIC_TENANT_SUBDOMAIN || 'demo');

                    console.log(`[NextAuth] jwt: syncing Google user ${user.email} → tenant "${tenant}" → ${baseUrl}`);

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
                        token.backendToken = data.access_token;
                        token.backendUser = data.user;
                        console.log(`[NextAuth] jwt: backend sync SUCCESS for ${user.email}`);
                    } else {
                        const errText = await res.text();
                        console.error(`[NextAuth] jwt: backend sync FAILED (${res.status}): ${errText}`);
                    }
                } catch (err) {
                    console.error('[NextAuth] jwt: backend sync exception:', err);
                }
            }

            return token;
        },
        async session({ session, token }: any) {
            if (token?.backendToken) {
                (session as any).backendToken = token.backendToken;
                (session as any).backendUser = token.backendUser;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'retailstore-secret-key-change-in-production',
};

const handler = async (req: NextRequest, ctx: { params: any }) => {
    // Dynamically set NEXTAUTH_URL for multi-tenant support through Nginx
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host) {
        process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };
