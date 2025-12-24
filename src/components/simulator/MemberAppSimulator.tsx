import { PhoneShell } from './PhoneShell';
import { Checklist } from './Checklist';
import { NotificationFeed } from './NotificationFeed';
import { EventSimulator } from './EventSimulator';

export function MemberAppSimulator() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Phone Shell with Member App */}
        <div className="flex justify-center lg:justify-start">
          <PhoneShell>
            <div className="space-y-6">
              <Checklist />
              <NotificationFeed />
            </div>
          </PhoneShell>
        </div>

        {/* Right: Control Panels */}
        <div className="flex items-start">
          <div className="w-full bg-card rounded-lg card-shadow p-6">
            <EventSimulator />
          </div>
        </div>
      </div>
    </div>
  );
}

