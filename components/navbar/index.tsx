'use client';

import { ModeToggle } from '../mode-toggle';
import { Button } from '../ui/button';
import { AppNameLogo } from './AppNameLogo';

export default function Navbar() {
  return (
    <div
      className={`font-sans relative w-full h-[92px] overflow-hidden flex items-center justify-between px-6 border-b `}
    >
      <AppNameLogo />
      <div className="flex items-center gap-3 justify-center">
        <Button>Add Task</Button>

        <ModeToggle />
      </div>
    </div>
  );
}
