
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardFiltersProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  showHumanRequired: boolean;
  onHumanRequiredChange: (checked: boolean) => void;
}

export function DashboardFilters({
  selectedDate,
  onDateChange,
  showHumanRequired,
  onHumanRequiredChange
}: DashboardFiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="bg-gradient-card rounded-lg border p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        {/* Filtro por fecha */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Fecha:</span>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start text-left font-normal min-w-[140px]",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateChange(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filtro por requiere humano */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="human-required"
            checked={showHumanRequired}
            onCheckedChange={onHumanRequiredChange}
          />
          <label
            htmlFor="human-required"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Solo casos que requieren humano
          </label>
        </div>

        {/* Botón para resetear filtros */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onDateChange(new Date());
            onHumanRequiredChange(false);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          Resetear
        </Button>
      </div>
    </div>
  );
}
