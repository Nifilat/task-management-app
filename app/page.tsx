import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';

const ProtectedRoute = dynamic(() => import('@/components/auth/ProtectedRoute'), {
  ssr: false,
});

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="font-sans">
        <Navbar />
      </div>
    </ProtectedRoute>
  );
}
