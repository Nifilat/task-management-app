import { DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { Tag } from "lucide-react";
import { LABEL_OPTIONS } from "./constants";

interface SubLabelMenuProps {
    value: string;
    onValueChange: (value: string) => void;
    onClickedLabelItem: (value: string) => void;
}

export function SubLabelMenu({
    value,
    onValueChange,
    onClickedLabelItem,
}: SubLabelMenuProps) {
    const handleValueChange = (newValue: string) => {
        onValueChange(newValue);

        onClickedLabelItem(newValue);
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Tag className="mr-2 h-4 w-4" />
                <span>Label</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="poppins">
                    <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
                        {LABEL_OPTIONS.map((option) => (
                            <DropdownMenuRadioItem key={option} value={option}>
                                {option}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
}