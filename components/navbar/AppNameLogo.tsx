import Image from 'next/image';

export default function AppNameLogo() {
  return (
    <header className="flex items-center gap-2">
      <Image src="/logo.png" width={40} height={40} alt="Task Manager Logo" priority />
      <h1 className="font-semibold text-2xl max-md:hidden">
        Task <span className="font-normal text-primary">Manager</span>
      </h1>
    </header>
  );
}
