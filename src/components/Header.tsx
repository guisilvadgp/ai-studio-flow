import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';
import { Settings, Zap } from 'lucide-react';

export function Header() {
  const openSettings = useSettingsStore((state) => state.openSettings);
  const apiKey = useSettingsStore((state) => state.apiKey);

  return (
    <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-gradient-cyber">PolliNodes</h1>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
          AI Studio
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!apiKey && (
          <span className="text-xs text-muted-foreground">
            No API key configured
          </span>
        )}
        {apiKey && (
          <div className="flex items-center gap-1 text-xs text-neon-green">
            <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
            Connected
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={openSettings}
          className="border-border/50"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </div>
    </header>
  );
}
