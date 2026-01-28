'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow login/register pages to render without auth check
  const isPublicPage = pathname === '/admin/login' || pathname === '/admin/register';

  useEffect(() => {
    // Only redirect if NOT loading, NOT a public page, and NOT authenticated/admin
    if (!loading && !isPublicPage && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, user, router, pathname, isPublicPage]);

  // Always render children for public pages (login/register)
  if (isPublicPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // If not authenticated and not public page, returning null prevents protected content from flashing
  // But due to the useEffect redirect above, this state shouldn't persist long
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-slate-50">
        {children}
      </main>
    </div>
  );
}