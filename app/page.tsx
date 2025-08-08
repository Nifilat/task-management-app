import Navbar from '@/components/navbar';
import StatsCard from '@/components/statsCard';
import TasksArea from '@/components/taskarea/TasksArea';

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Navbar />
      <StatsCard />
      <TasksArea />
    </div>
  );
}
