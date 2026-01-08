import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/settingsStore';
import { pollinationsClient } from '@/services/pollinationsClient';
import { Key, Check, X, Loader2 } from 'lucide-react';

export function SettingsModal() {
  const { 
    apiKey, 
    isKeyValid, 
    isSettingsOpen, 
    setApiKey, 
    setKeyValid, 
    closeSettings, 
    saveToStorage 
  } = useSettingsStore();
  
  const [inputValue, setInputValue] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  const handleValidate = async () => {
    if (!inputValue) return;
    
    setIsValidating(true);
    const isValid = await pollinationsClient.validateApiKey(inputValue);
    setIsValidating(false);
    setKeyValid(isValid);
    
    if (isValid) {
      setApiKey(inputValue);
      saveToStorage();
    }
  };

  const handleSave = () => {
    setApiKey(inputValue);
    saveToStorage();
    closeSettings();
  };

  const getKeyTypeLabel = () => {
    if (!inputValue) return null;
    if (inputValue.startsWith('pk_')) return 'Publishable Key (Client-side, rate-limited)';
    if (inputValue.startsWith('sk_')) return 'Secret Key (Server-side, no limits)';
    return 'Unknown key format';
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent className="sm:max-w-[425px] border-border/50 bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient-cyber">
            <Key className="h-5 w-5 text-primary" />
            API Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Pollinations.ai API key to unlock all features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                placeholder="pk_... or sk_..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setKeyValid(null);
                }}
                className="bg-secondary/50 border-border/50"
              />
              <Button 
                variant="outline" 
                onClick={handleValidate}
                disabled={!inputValue || isValidating}
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isKeyValid === true ? (
                  <Check className="h-4 w-4 text-neon-green" />
                ) : isKeyValid === false ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
            {getKeyTypeLabel() && (
              <p className="text-xs text-muted-foreground">{getKeyTypeLabel()}</p>
            )}
            {isKeyValid === false && (
              <p className="text-xs text-destructive">Invalid API key. Please check and try again.</p>
            )}
            {isKeyValid === true && (
              <p className="text-xs text-neon-green">API key is valid!</p>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• <strong>Publishable Keys (pk_)</strong>: Safe for client-side, IP rate-limited</p>
            <p>• <strong>Secret Keys (sk_)</strong>: Server-side only, no rate limits</p>
            <p className="pt-2">
              Get your API key at{' '}
              <a 
                href="https://enter.pollinations.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                enter.pollinations.ai
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeSettings}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!inputValue}>
            Save Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
