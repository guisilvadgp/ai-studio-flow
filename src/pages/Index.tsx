import { useEffect } from 'react';
import { FlowCanvas } from '@/components/FlowCanvas';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { useSettingsStore } from '@/store/settingsStore';

const Index = () => {
  const loadFromStorage = useSettingsStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <main className="flex-1 relative">
        <FlowCanvas />
      </main>
      <SettingsModal />
    </div>
  );
};

export default Index;
