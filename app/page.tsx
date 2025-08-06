import Navbar from '@/components/navbar';
import StatsCard from '@/components/statsCard';

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Navbar />
      <StatsCard />
    </div>
  );
}
