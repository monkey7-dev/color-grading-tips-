import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EmotionTraitItem } from '../data/psychologyData';

interface NodePosition {
  id: string;
  x: number;
  y: number;
  radius: number;
}

interface PsychologyGraphProps {
  items: EmotionTraitItem[];
  selectedItem: EmotionTraitItem;
  onSelectItem: (item: EmotionTraitItem) => void;
  culturalView: 'western' | 'eastern' | 'middleEastern';
}

export const PsychologyGraph: React.FC<PsychologyGraphProps> = ({
  items,
  selectedItem,
  onSelectItem,
  culturalView,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 900, height: 460 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<{ id: string; x: number; y: number } | null>(null);
  const [manualOffsets, setManualOffsets] = useState<Record<string, { x: number; y: number }>>({});

  // Resize listener
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(360, rect.width),
          height: Math.max(380, Math.min(500, window.innerHeight * 0.52)),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute canonical, balanced orbit positions
  const baseNodes: NodePosition[] = useMemo(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const minDim = Math.min(dimensions.width, dimensions.height);

    // Group items by category for clean concentric orbital placement
    const primary = items.filter(i => i.category === 'primary_emotion');
    const traits = items.filter(i => i.category === 'psychological_trait');
    const states = items.filter(i => i.category === 'emotional_state');

    const result: NodePosition[] = [];

    // Traits in inner orbit
    const rTraits = minDim * 0.22;
    traits.forEach((item, idx) => {
      const angle = (idx / traits.length) * 2 * Math.PI - Math.PI / 2;
      result.push({
        id: item.id,
        x: cx + Math.cos(angle) * rTraits,
        y: cy + Math.sin(angle) * rTraits,
        radius: 20,
      });
    });

    // Primary emotions in middle orbit
    const rPrimary = minDim * 0.33;
    primary.forEach((item, idx) => {
      const angle = (idx / primary.length) * 2 * Math.PI - Math.PI / 2 + 0.2;
      result.push({
        id: item.id,
        x: cx + Math.cos(angle) * rPrimary,
        y: cy + Math.sin(angle) * rPrimary,
        radius: 24,
      });
    });

    // Emotional states in outer orbit
    const rStates = minDim * 0.43;
    states.forEach((item, idx) => {
      const angle = (idx / states.length) * 2 * Math.PI - Math.PI / 2 + 0.45;
      result.push({
        id: item.id,
        x: cx + Math.cos(angle) * rStates,
        y: cy + Math.sin(angle) * rStates,
        radius: 22,
      });
    });

    return result;
  }, [items, dimensions]);

  // Merge with any user manual dragged offsets
  const nodes = useMemo(() => {
    return baseNodes.map(node => {
      if (draggedNode && draggedNode.id === node.id) {
        return { ...node, x: draggedNode.x, y: draggedNode.y };
      }
      const offset = manualOffsets[node.id];
      if (offset) {
        return { ...node, x: offset.x, y: offset.y };
      }
      return node;
    });
  }, [baseNodes, draggedNode, manualOffsets]);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  // Edges
  const edges = useMemo(() => {
    const list: { source: string; target: string }[] = [];
    const seen = new Set<string>();
    items.forEach(item => {
      item.connectedItemIds.forEach(targetId => {
        const key = [item.id, targetId].sort().join('--');
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ source: item.id, target: targetId });
        }
      });
    });
    return list;
  }, [items]);

  // Drag handlers
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDraggedNode({
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(dimensions.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(dimensions.height - 30, e.clientY - rect.top));
    setDraggedNode(prev => (prev ? { ...prev, x, y } : null));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedNode) {
      setManualOffsets(prev => ({
        ...prev,
        [draggedNode.id]: { x: draggedNode.x, y: draggedNode.y },
      }));
      setDraggedNode(null);
    }
  };

  const activeFocusId = hoveredNodeId || selectedItem.id;
  const activeItem = items.find(i => i.id === activeFocusId) || selectedItem;
  const connectedIds = useMemo(() => {
    return new Set([activeFocusId, ...activeItem.connectedItemIds]);
  }, [activeFocusId, activeItem]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full touch-none"
        style={{ height: dimensions.height }}
      >
        <defs>
          <radialGradient id="graphConstellationGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0f172a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={dimensions.width} height={dimensions.height} fill="url(#graphConstellationGlow)" />

        {/* Orbit track rings */}
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={Math.min(dimensions.width, dimensions.height) * 0.22}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={Math.min(dimensions.width, dimensions.height) * 0.33}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.height / 2}
          r={Math.min(dimensions.width, dimensions.height) * 0.43}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Edges */}
        {edges.map(edge => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return null;

          const isConnectedToFocus =
            edge.source === activeFocusId || edge.target === activeFocusId;
          const edgeColor = isConnectedToFocus ? activeItem.primaryColor : '#334155';
          const strokeWidth = isConnectedToFocus ? 2 : 1;
          const strokeOpacity = isConnectedToFocus ? 0.8 : 0.25;

          return (
            <line
              key={`${edge.source}--${edge.target}`}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke={edgeColor}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
              className="transition-colors duration-200"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const item = items.find(i => i.id === node.id);
          if (!item) return null;

          const isSelected = selectedItem.id === node.id;
          const isConnected = connectedIds.has(node.id);
          const isHovered = hoveredNodeId === node.id;
          const opacity = isConnected ? 1 : 0.35;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onPointerDown={e => handlePointerDown(node.id, e)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => onSelectItem(item)}
            >
              {/* Outer selection ring */}
              {isSelected && (
                <circle
                  r={node.radius + 7}
                  fill="none"
                  stroke={item.primaryColor}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity={0.9}
                />
              )}

              {/* Node Circle */}
              <circle
                r={node.radius}
                fill={item.primaryColor}
                fillOpacity={isHovered || isSelected ? 0.95 : 0.82}
                stroke={isSelected ? '#ffffff' : '#0f172a'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={opacity}
                className="transition-all duration-150"
              />

              {/* Inner core pip */}
              <circle
                r={3}
                cx={0}
                cy={node.radius - 6}
                fill="#ffffff"
                opacity={0.9}
              />

              {/* Text Label */}
              <text
                dy={node.radius + 14}
                textAnchor="middle"
                className={`text-[11px] font-medium pointer-events-none select-none ${
                  isSelected
                    ? 'fill-white font-bold text-xs'
                    : isConnected
                    ? 'fill-slate-200'
                    : 'fill-slate-500'
                }`}
              >
                {item.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Cultural Context Banner at the top of graph */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeItem.primaryColor }} />
          <span className="font-semibold text-white">{activeItem.name}:</span>
          <span className="italic truncate max-w-xs md:max-w-md">
            {activeItem.culturalVariations[culturalView]}
          </span>
        </div>
        <div className="hidden sm:block text-[10px] text-slate-400 bg-slate-900/70 px-2 py-1 rounded border border-slate-800">
          Drag nodes · Click to inspect
        </div>
      </div>
    </div>
  );
};
