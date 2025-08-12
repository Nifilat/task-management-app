import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/navbar/Navbar';
import StatsCard from '@/components/statsCard';
import TasksArea from '@/components/taskarea/TasksArea';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'Manage your tasks efficiently',
};

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <StatsCard />
            <TasksArea />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
