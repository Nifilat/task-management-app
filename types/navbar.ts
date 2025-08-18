export interface MenuItem {
  icon?: string;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

export type MenuItemOrSeparator = MenuItem | 'separator';

export interface UserMenuProps {
  menuItems: MenuItemOrSeparator[];
  avatarUrl: string;
  fullName: string;
  email: string;
}

export interface MobileMenuProps {
  menuItems: MenuItemOrSeparator[];
  avatarUrl: string;
  fullName: string;
  email: string;
}

export interface DesktopActionsProps {
  menuItems: MenuItemOrSeparator[];
  avatarUrl: string;
  fullName: string;
  email: string;
}
