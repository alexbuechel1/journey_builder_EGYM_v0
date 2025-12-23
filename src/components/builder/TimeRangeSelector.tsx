import type { TimeRange, TimeRangeType, TimeUnit, Reminder } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReminderList } from './ReminderList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (timeRange: TimeRange) => void;
  previousActionExists: boolean;
  reminders?: Reminder[];
  onRemindersChange?: (reminders: Reminder[]) => void;
  onAddReminder?: () => void;
}

const TIME_UNITS: { value: TimeUnit; label: string }[] = [
  { value: 'DAYS', label: 'days' },
  { value: 'WEEKS', label: 'weeks' },
  { value: 'MONTHS', label: 'months' },
];

// Convert days to display value based on unit (integers only)
function daysToDisplayValue(days: number | undefined, unit: TimeUnit | undefined): number | undefined {
  if (!days) return undefined;
  if (!unit || unit === 'DAYS') return days;
  if (unit === 'WEEKS') return Math.round(days / 7);
  if (unit === 'MONTHS') return Math.round(days / 30);
  return days;
}

// Convert display value to days based on unit (integers only)
function displayValueToDays(value: number | undefined, unit: TimeUnit | undefined): number | undefined {
  if (!value) return undefined;
  if (!unit || unit === 'DAYS') return Math.round(value);
  if (unit === 'WEEKS') return Math.round(value * 7);
  if (unit === 'MONTHS') return Math.round(value * 30);
  return Math.round(value);
}

export function TimeRangeSelector({
  value,
  onChange,
  previousActionExists,
  reminders = [],
  onRemindersChange,
  onAddReminder,
}: TimeRangeSelectorProps) {
  const handleTypeChange = (type: TimeRangeType) => {
    if (type === 'NONE') {
      onChange({ type: 'NONE' });
    } else if (type === 'ABSOLUTE') {
      onChange({ 
        type: 'ABSOLUTE', 
        durationDays: value.durationDays || 7,
        durationUnit: value.durationUnit || 'DAYS'
      });
    } else if (type === 'WITH_PREVIOUS') {
      onChange({ 
        type: 'WITH_PREVIOUS', 
        offsetDays: value.offsetDays || 1,
        offsetUnit: value.offsetUnit || 'DAYS'
      });
    }
  };

  const handleDurationChange = (newValue: number | undefined, unit: TimeUnit) => {
    const days = displayValueToDays(newValue, unit);
    onChange({
      ...value,
      durationDays: days,
      durationUnit: unit,
    });
  };

  const handleOffsetChange = (newValue: number | undefined, unit: TimeUnit) => {
    const days = displayValueToDays(newValue, unit);
    onChange({
      ...value,
      offsetDays: days,
      offsetUnit: unit,
    });
  };

  const displayDuration = daysToDisplayValue(value.durationDays, value.durationUnit || 'DAYS');
  const displayOffset = daysToDisplayValue(value.offsetDays, value.offsetUnit || 'DAYS');

  const hasTimeRange = value.type !== 'NONE';

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-body-50-bold block mb-2">When is this action due?</Label>
        <p className="text-body-50 text-muted-foreground text-sm mb-4">
          By default an action doesn't have a deadline. You can add one and then also set reminders for your members and trainers.
        </p>
      </div>
      
      <RadioGroup value={value.type} onValueChange={handleTypeChange}>
        <div className="space-y-3">
          {/* No deadline option */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="NONE" id="time-none" className="mt-1" />
            <Label htmlFor="time-none" className="flex-1 cursor-pointer">
              <div className="text-body-50 font-medium text-foreground">No deadline</div>
              <div className="text-body-50 text-muted-foreground text-xs mt-0.5">
                Action has no time limit
              </div>
            </Label>
          </div>

          {/* Days from start option */}
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="ABSOLUTE" id="time-absolute" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="time-absolute" className="cursor-pointer">
                <div className="text-body-50 font-medium text-foreground">Days from start</div>
                <div className="text-body-50 text-muted-foreground text-xs mt-0.5">
                  Fixed duration from journey start
                </div>
              </Label>
              {value.type === 'ABSOLUTE' && (
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={displayDuration || ''}
                    onChange={(e) => {
                      const numValue = e.target.value ? parseInt(e.target.value, 10) : undefined;
                      if (numValue && numValue > 0) {
                        handleDurationChange(numValue, value.durationUnit || 'DAYS');
                      } else if (e.target.value === '') {
                        handleDurationChange(undefined, value.durationUnit || 'DAYS');
                      }
                    }}
                    className="w-24 h-9"
                    aria-label="Duration"
                  />
                  <Select
                    value={value.durationUnit || 'DAYS'}
                    onValueChange={(unit) => {
                      const currentDisplay = displayDuration;
                      handleDurationChange(currentDisplay, unit as TimeUnit);
                    }}
                  >
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* After previous option */}
          {previousActionExists && (
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="WITH_PREVIOUS" id="time-previous" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="time-previous" className="cursor-pointer">
                  <div className="text-body-50 font-medium text-foreground">After previous</div>
                  <div className="text-body-50 text-muted-foreground text-xs mt-0.5">
                    Relative to previous action
                  </div>
                </Label>
                {value.type === 'WITH_PREVIOUS' && (
                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={displayOffset || ''}
                      onChange={(e) => {
                        const numValue = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        if (numValue && numValue > 0) {
                          handleOffsetChange(numValue, value.offsetUnit || 'DAYS');
                        } else if (e.target.value === '') {
                          handleOffsetChange(undefined, value.offsetUnit || 'DAYS');
                        }
                      }}
                      className="w-24 h-9"
                      aria-label="Offset"
                    />
                    <Select
                      value={value.offsetUnit || 'DAYS'}
                      onValueChange={(unit) => {
                        const currentDisplay = displayOffset;
                        handleOffsetChange(currentDisplay, unit as TimeUnit);
                      }}
                    >
                      <SelectTrigger className="w-28 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_UNITS.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-body-50 text-muted-foreground text-sm">after previous action</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      {/* Reminders Section - Only shown when time range is set */}
      {hasTimeRange && onRemindersChange && onAddReminder && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body-50-bold text-foreground">Reminders</h3>
              <p className="text-body-50 text-muted-foreground mt-0.5 text-sm">
                Notify members or trainers when action is due or overdue
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddReminder}
              className="gap-2"
              aria-label="Add reminder"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Reminder
            </Button>
          </div>
          {reminders.length > 0 ? (
            <ReminderList reminders={reminders} onUpdate={onRemindersChange} />
          ) : (
            <div className="p-8 rounded-lg border border-dashed border-border bg-muted/30 text-center">
              <p className="text-body-50 text-muted-foreground">
                No reminders configured. Click "Add Reminder" to set up notifications.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
