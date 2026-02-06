'use client';
// Simple wrapper to show just the history part
import ProfilePage from '../profile/page'; 

export default function OrdersPage() {
  // For MVP, we can reuse the profile logic or just redirect
  // Let's reuse the profile component but you might want to strip the header later
  return <ProfilePage />;
}