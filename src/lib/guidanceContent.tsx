import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Action } from './types';

const APP_DOWNLOAD_URL = 'https://id1qz.app.link/nfc';

interface GuidanceContentProps {
  action: Action;
}

/**
 * Renders guidance content for specific action/product combinations
 */
export function renderGuidanceContent({ action }: GuidanceContentProps): React.ReactNode {
  // A01 (EGYM Account created) + BMA (Member App) = Show app download content
  if (action.actionTypeId === 'A01' && action.product === 'BMA') {
    return (
      <div className="space-y-4">
        <p className="text-body-100 text-foreground">
          To get started with your EGYM journey, download the Member App. The app allows you to track your workouts, 
          access personalized training plans, and connect with your fitness goals.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-lg border border-border">
              <QRCodeSVG
                value={APP_DOWNLOAD_URL}
                size={150}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-body-50 text-muted-foreground text-center">
              Scan to download
            </p>
          </div>
          
          {/* Download Button */}
          <Button
            onClick={() => window.open(APP_DOWNLOAD_URL, '_blank')}
            variant="default"
            size="default"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download App
          </Button>
        </div>
      </div>
    );
  }
  
  // A01 (EGYM Account created) + FITHUB (Fitness Hub) = Show GIF with instructions
  if (action.actionTypeId === 'A01' && action.product === 'FITHUB') {
    return (
      <div className="space-y-4">
        <p className="text-body-100 text-foreground">
          Go to the EGYM Fitness Hub to setup your EGYM account. With your EGYM account you can access personalized workouts, track your progress, and discover advanced training programs.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          {/* GIF */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border border-border overflow-hidden max-w-xs">
              <img
                src="/gifs/fitness-hub-guide.gif"
                alt="Fitness Hub guide"
                className="w-full h-auto"
              />
            </div>
            <p className="text-body-50 text-muted-foreground text-center max-w-md">
              Follow the steps shown above to get started with Fitness Hub
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Default placeholder for other actions
  return (
    <p className="text-body-100 text-foreground">
      Guidance content will be displayed here. This is a placeholder for future implementation.
    </p>
  );
}

