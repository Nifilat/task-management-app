import ProtectedRoute from '@/components/auth/ProtectedRoute';
// import Navbar from '@/components/layout/Navbar';
import { Navbar } from '@/components/navbar';
import StatsCard from '@/components/statsCard';
import TasksArea from '@/components/taskarea/TasksArea';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen">
        <Navbar />
        <StatsCard />
        <TasksArea />
      </div>
    </ProtectedRoute>
  );
}
