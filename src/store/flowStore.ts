import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  Connection, 
  NodeChange, 
  EdgeChange, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';

export type NodeType = 'prompt' | 'llm' | 'imageGenerator' | 'imageOutput' | 'videoDirector' | 'display';

export interface PromptNodeData {
  type: 'prompt';
  label: string;
  prompt: string;
  [key: string]: unknown;
}

export interface LLMNodeData {
  type: 'llm';
  label: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  imageUrl?: string;
  output?: string;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface ImageGeneratorNodeData {
  type: 'imageGenerator';
  label: string;
  model: string;
  prompt: string;
  width: number;
  height: number;
  seed?: number;
  imageCount?: number;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface ImageOutputNodeData {
  type: 'imageOutput';
  label: string;
  imageUrl?: string;
  index: number;
  seed?: number;
  [key: string]: unknown;
}

export interface VideoDirectorNodeData {
  type: 'videoDirector';
  label: string;
  model: string;
  prompt: string;
  imageUrl?: string;
  outputUrl?: string;
  isLoading?: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface DisplayNodeData {
  type: 'display';
  label: string;
  inputType: 'text' | 'image' | 'video' | 'auto';
  content?: string;
  [key: string]: unknown;
}

export type FlowNodeData = PromptNodeData | LLMNodeData | ImageGeneratorNodeData | ImageOutputNodeData | VideoDirectorNodeData | DisplayNodeData;

export type FlowNode = Node<FlowNodeData>;

interface FlowState {
  nodes: FlowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  addNode: (node: FlowNode) => void;
  updateNodeData: <T extends FlowNodeData>(nodeId: string, data: Partial<T>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  
  setSelectedNode: (nodeId: string | null) => void;
  
  getNodeOutput: (nodeId: string) => string | undefined;
  getConnectedInputs: (nodeId: string) => { type: string; value: string }[];
}

const initialNodes: FlowNode[] = [];
const initialEdges: Edge[] = [];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: <T extends FlowNodeData>(nodeId: string, data: Partial<T>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as T }
          : node
      ),
    });
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  deleteEdge: (edgeId: string) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },

  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  getNodeOutput: (nodeId: string) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return undefined;

    const data = node.data;
    switch (data.type) {
      case 'prompt':
        return data.prompt;
      case 'llm':
        return data.output;
      case 'imageGenerator':
        return undefined; // Image generator doesn't have direct output anymore
      case 'imageOutput':
        return data.imageUrl;
      case 'videoDirector':
        return data.outputUrl;
      case 'display':
        return data.content;
      default:
        return undefined;
    }
  },

  getConnectedInputs: (nodeId: string) => {
    const edges = get().edges.filter((e) => e.target === nodeId);
    const inputs: { type: string; value: string }[] = [];

    for (const edge of edges) {
      const output = get().getNodeOutput(edge.source);
      if (output) {
        const sourceNode = get().nodes.find((n) => n.id === edge.source);
        inputs.push({
          type: sourceNode?.data.type || 'unknown',
          value: output,
        });
      }
    }

    return inputs;
  },
}));
