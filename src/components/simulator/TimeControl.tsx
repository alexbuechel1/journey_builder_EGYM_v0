import { useState } from 'react';
import { format } from 'date-fns';
import { useSimulator } from '@/contexts/SimulatorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, FastForward, RotateCcw } from 'lucide-react';

export function TimeControl() {
  const { simulatedTime, setSimulatedTime, fastForwardDays, resetToNow } = useSimulator();
  const [fastForwardInput, setFastForwardInput] = useState('');
  const [dateInput, setDateInput] = useState(
    format(simulatedTime, "yyyy-MM-dd'T'HH:mm")
  );

  const handleSetTime = () => {
    const newDate = new Date(dateInput);
    if (!isNaN(newDate.getTime())) {
      setSimulatedTime(newDate);
    }
  };

  const handleFastForward = () => {
    const days = parseInt(fastForwardInput, 10);
    if (!isNaN(days) && days > 0) {
      fastForwardDays(days);
      setFastForwardInput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-body-100 font-medium text-foreground">Time Control</h3>
      </div>

      {/* Current Time Display */}
      <div className="rounded-lg border border-input bg-background p-4">
        <Label className="text-body-50 text-muted-foreground mb-1 block">
          Current Simulated Time
        </Label>
        <div className="text-body-100 font-medium text-foreground">
          {format(simulatedTime, 'PPpp')}
        </div>
      </div>

      {/* Set Specific Time */}
      <div className="space-y-2">
        <Label htmlFor="date-picker" className="text-body-50 text-foreground">
          Set Time To
        </Label>
        <div className="flex gap-2">
          <Input
            id="date-picker"
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSetTime} size="default">
            Set
          </Button>
        </div>
      </div>

      {/* Fast Forward */}
      <div className="space-y-2">
        <Label htmlFor="fast-forward" className="text-body-50 text-foreground">
          Fast Forward
        </Label>
        <div className="flex gap-2">
          <Input
            id="fast-forward"
            type="number"
            min="1"
            placeholder="Days"
            value={fastForwardInput}
            onChange={(e) => setFastForwardInput(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleFastForward}
            variant="outline"
            size="default"
            disabled={!fastForwardInput || parseInt(fastForwardInput, 10) <= 0}
          >
            <FastForward className="h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>

      {/* Reset to Now */}
      <Button
        onClick={resetToNow}
        variant="outline"
        className="w-full"
        size="default"
      >
        <RotateCcw className="h-4 w-4" />
        Reset to Now
      </Button>
    </div>
  );
}

