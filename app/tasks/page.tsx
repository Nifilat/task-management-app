import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
const Navbar = dynamic(() => import('@/components/navbar/Navbar'));
const StatsCard = dynamic(() => import('@/components/statsCard'));
const TasksArea = dynamic(() => import('@/components/taskarea/TasksArea'));

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
