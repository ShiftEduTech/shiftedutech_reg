import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', label }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
      )}
      <button
        type="button"
        className={`w-full flex items-center px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl font-normal text-left ${!value ? 'text-gray-400' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-purple-600" />
        {value ? value.toLocaleDateString() : <span>{placeholder}</span>}
      </button>
      {open && (
        <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date ?? undefined);
              setOpen(false);
            }}
            initialFocus
            captionLayout="dropdown"
            fromYear={2000}
            toYear={new Date().getFullYear() + 5}
          />
        </div>
      )}
    </div>
  );
} 