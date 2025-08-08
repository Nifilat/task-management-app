import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="font-sans">
        <Navbar />
      </div>
    </ProtectedRoute>
  );
}
