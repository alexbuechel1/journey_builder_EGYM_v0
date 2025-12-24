import { useSimulator } from '@/contexts/SimulatorContext';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';

export function NotificationFeed() {
  const { notifications, markNotificationRead } = useSimulator();

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const handleNotificationClick = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-body-100 font-medium text-foreground">Notifications</h3>
        {sortedNotifications.length > 0 && (
          <span className="text-body-50 text-muted-foreground">
            ({sortedNotifications.length})
          </span>
        )}
      </div>

      {sortedNotifications.length === 0 ? (
        <div className="rounded-lg border border-input bg-background p-8 text-center">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-body-100 text-muted-foreground">No notifications yet</p>
          <p className="text-body-50 text-muted-foreground mt-1">
            Notifications will appear here when actions become overdue
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

