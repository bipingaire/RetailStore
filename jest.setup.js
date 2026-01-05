import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        };
    },
    useSearchParams() {
        return {
            get: jest.fn(),
        };
    },
    usePathname() {
        return '';
    },
}));

// Mock Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
    createClientComponentClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    data: [],
                    error: null,
                })),
            })),
        })),
    })),
}));
