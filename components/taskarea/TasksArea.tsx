'use client';

import SearchInput from './SearchInput';
import { Card, CardHeader, CardFooter, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import PriorityDropDown from '../dropdown/priority-dropdown';
import StatusDropDown from '../dropdown/status-dropdown';
import ViewColumnsDropDown from '../dropdown/view-columns-dropdown';

const TasksArea = () => {
  return (
    <div className="px-7 mt-5">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchInput />
              {/* status drop down */}
              <StatusDropDown />
              {/* priority drop down */}
              <PriorityDropDown />

              <Button variant={'ghost'} className="h-10">
                <span>Reset</span>
                <X />
              </Button>
            </div>

            {/* DropDownViewColumns */}
            <ViewColumnsDropDown />
          </div>
        </CardHeader>
        <CardContent>{/* table */}</CardContent>
        <CardFooter>{/* Pagination Area */}</CardFooter>
      </Card>
    </div>
  );
};

export default TasksArea;
