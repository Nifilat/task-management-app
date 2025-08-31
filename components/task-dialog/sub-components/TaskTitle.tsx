import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { TaskFormData } from '../TaskDialogSchema';

export default function TaskTitle() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TaskFormData>();
  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-75 text-sm font-medium">Task Title</Label>
      <Input
        id="task-title-input"
        placeholder="Joe Doe..."
        {...register('title')}
        className="h-11 px-4 py-3"
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
    </div>
  );
}
