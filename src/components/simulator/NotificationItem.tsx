import { format, formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/lib/types';
import { Bell, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = notification.type === 'PUSH' ? Bell : Mail;
  const timeAgo = formatDistanceToNow(notification.timestamp, { addSuffix: true });
  const fullTime = format(notification.timestamp, 'PPpp');

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-colors cursor-pointer',
        notification.read
          ? 'border-input bg-background'
          : 'border-primary/20 bg-primary/5',
        onClick && 'hover:bg-accent'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            notification.type === 'PUSH'
              ? 'bg-primary/10 text-primary'
              : 'bg-blue-500/10 text-blue-600'
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-body-100 font-medium text-foreground">
                {notification.actionTitle}
              </div>
              <div className="text-body-50 text-muted-foreground mt-1">
                {notification.message}
              </div>
            </div>
            {!notification.read && (
              <div className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1" />
            )}
          </div>
          <div className="text-marginal-25 text-muted-foreground mt-2" title={fullTime}>
            {timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
}

