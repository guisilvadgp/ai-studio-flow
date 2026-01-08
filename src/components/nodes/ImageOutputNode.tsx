import { Handle, Position, NodeProps } from '@xyflow/react';
import { ImageIcon, Download, ExternalLink } from 'lucide-react';
import { useFlowStore, ImageOutputNodeData } from '@/store/flowStore';
import { BaseNodeWrapper } from './BaseNodeWrapper';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function ImageOutputNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageOutputNodeData;
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const [imageLoading, setImageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (nodeData.imageUrl) {
      setImageLoading(true);
      setHasError(false);
    }
  }, [nodeData.imageUrl]);

  const handleDownload = async () => {
    if (!nodeData.imageUrl) return;
    
    try {
      const response = await fetch(nodeData.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${nodeData.index + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <BaseNodeWrapper 
      title={`Image ${nodeData.index + 1}`} 
      icon={<ImageIcon className="h-4 w-4" />}
      variant="tertiary"
      selected={selected}
      onDelete={() => deleteNode(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-node-tertiary !border-2 !border-background"
      />

      <div className="space-y-2">
        {nodeData.imageUrl ? (
          <div className="relative rounded overflow-hidden border border-border/30">
            {imageLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="h-6 w-6 border-2 border-foreground/40 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {hasError ? (
              <div className="flex items-center justify-center h-[120px] bg-muted text-muted-foreground text-xs">
                Failed to load image
              </div>
            ) : (
              <img 
                src={nodeData.imageUrl} 
                alt={`Generated ${nodeData.index + 1}`} 
                className="w-full h-auto max-h-[150px] object-cover"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setHasError(true);
                }}
              />
            )}
            {!imageLoading && !hasError && (
              <div className="absolute bottom-1 right-1 flex gap-1">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6"
                  onClick={() => window.open(nodeData.imageUrl, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80px] rounded border border-dashed border-border text-muted-foreground text-xs">
            Waiting for generation...
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-node-tertiary !border-2 !border-background"
      />
    </BaseNodeWrapper>
  );
}
