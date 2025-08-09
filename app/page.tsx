import dynamic from 'next/dynamic';

const ProtectedRoute = dynamic(() => import('@/components/auth/ProtectedRoute'), {
  ssr: false,
});

const Navbar = dynamic(() => import('@/components/layout/Navbar'), {
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
