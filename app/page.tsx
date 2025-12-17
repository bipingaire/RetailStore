import { redirect } from 'next/navigation';

export default function RootPage() {
  // Directly load the shopping website as requested.
  // The Admin Console is accessible via /admin (or a separate subdomain in production)
  redirect('/shop');
}