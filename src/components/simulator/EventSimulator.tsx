import { useState } from 'react';
import { format } from 'date-fns';
import { useSimulator } from '@/contexts/SimulatorContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllActionLibraryItems } from '@/lib/actionLibrary';
import type { Product } from '@/lib/types';
import { Zap } from 'lucide-react';

const PRODUCTS: Product[] = ['BMA', 'FITHUB', 'TRAINER_APP', 'SMART_STRENGTH', 'UNKNOWN'];

export function EventSimulator() {
  const { triggerEvent, events } = useSimulator();
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product>('BMA');

  // Get unique event types from action library
  const actionLibraryItems = getAllActionLibraryItems();
  const eventTypes = Array.from(
    new Set(actionLibraryItems.map((item) => item.eventType))
  ).sort();

  const handleTriggerEvent = async () => {
    if (!selectedEventType) return;
    await triggerEvent(selectedEventType, selectedProduct);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-body-100 font-medium text-foreground">Event Simulator</h3>
      </div>

      {/* Event Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="event-type" className="text-body-50 text-foreground">
          Event Type
        </Label>
        <Select value={selectedEventType} onValueChange={setSelectedEventType}>
          <SelectTrigger id="event-type">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((eventType) => (
              <SelectItem key={eventType} value={eventType}>
                {eventType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Selection */}
      <div className="space-y-2">
        <Label htmlFor="product" className="text-body-50 text-foreground">
          Product
        </Label>
        <Select
          value={selectedProduct}
          onValueChange={(value) => setSelectedProduct(value as Product)}
        >
          <SelectTrigger id="product">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRODUCTS.map((product) => (
              <SelectItem key={product} value={product}>
                {product}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Trigger Button */}
      <Button
        onClick={handleTriggerEvent}
        disabled={!selectedEventType}
        className="w-full"
        size="default"
      >
        <Zap className="h-4 w-4" />
        Trigger Event
      </Button>

      {/* Event History */}
      {events.length > 0 && (
        <div className="space-y-2">
          <Label className="text-body-50 text-foreground">Recent Events</Label>
          <div className="rounded-lg border border-input bg-background max-h-48 overflow-y-auto">
            <div className="divide-y divide-border">
              {events.slice(0, 10).map((event) => (
                <div key={event.id} className="p-3 text-body-100">
                  <div className="font-medium text-foreground">{event.eventType}</div>
                  <div className="text-body-50 text-muted-foreground">
                    {event.product} • {format(event.occurredAt, 'PPpp')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

