import type { Reminder, ReminderChannel, ReminderFrequency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ReminderListProps {
  reminders: Reminder[];
  onUpdate: (reminders: Reminder[]) => void;
}

const CHANNEL_OPTIONS: { value: ReminderChannel; label: string }[] = [
  { value: 'PUSH', label: 'Push Notification' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'TRAINER', label: 'Trainer Task' },
  { value: 'WEBHOOK', label: 'Webhook' },
];

const FREQUENCY_OPTIONS: { value: ReminderFrequency; label: string }[] = [
  { value: 'ONCE', label: 'Once' },
  { value: 'EVERY_X_DAYS', label: 'Repeat every' },
];

export function ReminderList({ reminders, onUpdate }: ReminderListProps) {
  const handleChannelChange = (reminderId: string, channel: ReminderChannel) => {
    const updated = reminders.map((r) =>
      r.id === reminderId ? { ...r, channel } : r
    );
    onUpdate(updated);
  };

  const handleFrequencyChange = (reminderId: string, frequency: ReminderFrequency) => {
    const updated = reminders.map((r) =>
      r.id === reminderId ? { ...r, frequencyType: frequency, frequencyDays: frequency === 'EVERY_X_DAYS' ? r.frequencyDays || 3 : undefined } : r
    );
    onUpdate(updated);
  };

  const handleFrequencyDaysChange = (reminderId: string, days: number) => {
    const updated = reminders.map((r) =>
      r.id === reminderId ? { ...r, frequencyDays: days } : r
    );
    onUpdate(updated);
  };

  const handleDelete = (reminderId: string) => {
    const updated = reminders.filter((r) => r.id !== reminderId);
    onUpdate(updated);
  };

  return (
    <div className="space-y-3">
      {reminders.map((reminder, index) => (
        <Card key={reminder.id} className="p-4 bg-primary/5 border-2 border-primary/20 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-body-50-bold text-foreground">Reminder {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(reminder.id)}
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete reminder"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-body-50-bold mb-1.5 block text-xs">Channel</Label>
                  <Select
                    value={reminder.channel}
                    onValueChange={(value) =>
                      handleChannelChange(reminder.id, value as ReminderChannel)
                    }
                  >
                    <SelectTrigger className="w-full h-9" aria-label="Reminder channel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-body-50-bold mb-1.5 block text-xs">Frequency</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={reminder.frequencyType}
                      onValueChange={(value) =>
                        handleFrequencyChange(reminder.id, value as ReminderFrequency)
                      }
                    >
                      <SelectTrigger className="h-9" aria-label="Reminder frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {reminder.frequencyType === 'EVERY_X_DAYS' && (
                      <>
                        <Input
                          type="number"
                          min="1"
                          value={reminder.frequencyDays || 3}
                          onChange={(e) =>
                            handleFrequencyDaysChange(
                              reminder.id,
                              parseInt(e.target.value) || 3
                            )
                          }
                          className="w-16 h-9"
                          aria-label="Frequency days"
                        />
                        <span className="text-body-50 text-muted-foreground whitespace-nowrap">days</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

