import TaskDialog from '@/components/task-dialog/TaskDialog';
import { ModeToggle } from '@/components/mode-toggle';
import UserMenu from './UserMenu';

interface DesktopActionsProps {
  menuItems: any[];
  avatarUrl: string;
  fullName: string;
  email: string;
}

export default function DesktopActions({ menuItems, avatarUrl, fullName, email }: DesktopActionsProps) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <TaskDialog />
      <ModeToggle />
      <UserMenu menuItems={menuItems} avatarUrl={avatarUrl} fullName={fullName} email={email} />
    </div>
  );
}
