import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="font-sans">
        <Navbar />
      </div>
    </ProtectedRoute>
  );
}
