import { Menu, LucideIcon } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import UserHeader from './UserHeader';
import * as Icons from 'lucide-react';

interface MobileMenuProps {
  menuItems: any[];
  avatarUrl: string;
  fullName: string;
  email: string;
}

export default function MobileMenu({ menuItems, avatarUrl, fullName, email }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="cursor-pointer h-6 w-6" />
        </SheetTrigger>

        <SheetContent side="left" className="p-4 flex flex-col gap-4">
          {/* User Info */}
          <UserHeader avatarUrl={avatarUrl} fullName={fullName} email={email} />

          {/* Navigation Items */}
          <nav className="mt-4 flex flex-col gap-2">
            {menuItems.map((item: any, index: number) =>
              item === 'separator' ? (
                <hr key={index} className="border-t border-gray-200 my-2" />
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex items-center gap-2 p-3 rounded hover:bg-gray-100 active:bg-gray-200 transition text-left ${
                    item.destructive ? 'text-red-500' : ''
                  }`}
                >
                  {item.icon && (() => {
                    const IconComponent = Icons[item.icon as keyof typeof Icons] as LucideIcon;
                    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                  })()}
                  {item.label}
                </button>
              )
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
