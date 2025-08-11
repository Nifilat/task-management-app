import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface UserHeaderProps {
  avatarUrl: string;
  fullName: string;
  email: string;
}

export default function UserHeader({ avatarUrl, fullName, email }: UserHeaderProps) {
  return (
    <div className="flex flex-col items-start">
      <Avatar className="cursor-pointer hover:ring-2 hover:ring-ring transition-all">
        <AvatarImage src={avatarUrl} alt={fullName} />
      </Avatar>
      <div className="mt-2">
        <span className="text-sm font-medium">{fullName}</span>
        <span className="text-xs text-muted-foreground block">{email}</span>
      </div>
    </div>
  );
}
