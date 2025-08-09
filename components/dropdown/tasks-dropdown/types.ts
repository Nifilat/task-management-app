import { LucideIcon } from "lucide-react";

export type Kind = "edit" | "copy" | "favorite" | "delete";

export type MenuItemType = {
    icon: LucideIcon;
    label: string;
    kind: Kind;
    shortcut: string;
}