"use client";

// app/InfiniteCanvas.tsx
import React, { useEffect, useRef, useState } from "react";
// 先本地模式跑通；接 AO 时再解开 @permaweb/ao-connect 的逻辑

type Tile = { id: number; x: number; y: number; content?: string };
type Dir = "up" | "down" | "left" | "right";

const TILE_SIZE = 180;

export default function InfiniteCanvas() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dir, setDir] = useState<Dir>("right");
  const [content, setContent] = useState("");

  // 画布平移缩放
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // 初始化：本地模式直接放一个原点块
  useEffect(() => {
    setTiles([{ id: 0, x: 0, y: 0, content: "Origin" }]);
    setSelected({ x: 0, y: 0 });
  }, []);

  // 追加新块（本地模式）
  const append = async () => {
    if (!selected) return;
    const dx = dir === "left" ? -1 : dir === "right" ? 1 : 0;
    const dy = dir === "up" ? -1 : dir === "down" ? 1 : 0;
    const x = selected.x + dx;
    const y = selected.y + dy;

    if (tiles.some((t) => t.x === x && t.y === y)) {
      alert("该位置已有块");
      return;
    }
    const newTile = { id: tiles.length, x, y, content };
    setTiles((prev) => [...prev, newTile]);
    setSelected({ x, y });
    setContent("");
  };

  // 工具：坐标转像素
  const toPx = (x: number, y: number) => ({
    left: x * TILE_SIZE * scale + offset.x,
    top: y * TILE_SIZE * scale + offset.y,
    size: TILE_SIZE * scale,
  });

  // 交互：缩放/拖拽
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale((s) => Math.max(0.2, Math.min(3, s * factor)));
  };
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current || !dragStart.current) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    dragging.current = false;
    dragStart.current = null;
  };

  const keyFor = (x: number, y: number) => `${x},${y}`;
  const taken = new Set(tiles.map((t) => keyFor(t.x, t.y)));

  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-50 text-sm">
      {/* 控制栏 */}
      <div className="fixed left-4 top-4 z-20 p-3 rounded-2xl shadow bg-white/90 flex gap-2 items-center">
        <div>
          <div className="font-semibold">参考块</div>
          <div>{selected ? `${selected.x}, ${selected.y}` : "未选择"}</div>
        </div>
        <select
          value={dir}
          onChange={(e) => setDir(e.target.value as Dir)}
          className="border rounded px-2 py-1"
        >
          <option value="up">上</option>
          <option value="down">下</option>
          <option value="left">左</option>
          <option value="right">右</option>
        </select>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入内容..."
          className="border rounded px-2 py-1 w-72"
        />
        <button onClick={append} className="px-3 py-1 rounded bg-black text-white">
          追加新块
        </button>
      </div>

      {/* 画布层 */}
      <div
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* 简单网格背景 */}
        <svg width="100%" height="100%" className="absolute inset-0 -z-10">
          <defs>
            <pattern id="grid" width={TILE_SIZE} height={TILE_SIZE} patternUnits="userSpaceOnUse">
              <path d={`M ${TILE_SIZE} 0 L 0 0 0 ${TILE_SIZE}`} fill="none" stroke="#ddd" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* 已占用块 */}
        {tiles.map((t) => {
          const { left, top, size } = toPx(t.x, t.y);
          const isSelected = selected && selected.x === t.x && selected.y === t.y;
          return (
            <div
              key={t.id}
              className={`absolute rounded-xl border ${
                isSelected ? "border-black" : "border-neutral-300"
              } bg-white shadow-sm`}
              style={{ left, top, width: size, height: size }}
              onClick={(e) => {
                e.stopPropagation();
                setSelected({ x: t.x, y: t.y });
              }}
              onMouseDown={(e) => {
                // 阻止穿透到画布触发拖拽
                e.stopPropagation();
              }}
            >
              <div className="p-2 text-neutral-500 text-xs">
                ({t.x},{t.y}) · id:{t.id}
              </div>
              <div className="p-3 text-base whitespace-pre-wrap">
                {t.content || "空"}
              </div>
            </div>
          );
        })}

        {/* 候选位置（上下左右） */}
        {selected &&
          (["up", "down", "left", "right"] as Dir[]).map((d) => {
            const dx = d === "left" ? -1 : d === "right" ? 1 : 0;
            const dy = d === "up" ? -1 : d === "down" ? 1 : 0;
            const x = selected.x + dx;
            const y = selected.y + dy;
            const { left, top, size } = toPx(x, y);
            if (taken.has(keyFor(x, y))) return null;
            return (
              <div
                key={`ghost-${d}`}
                className={`absolute rounded-xl border-dashed border-2 ${
                  dir === d ? "border-black" : "border-neutral-300"
                } bg-white/50`}
                style={{ left, top, width: size, height: size }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDir(d);
                }}
                onMouseDown={(e) => {
                  // 阻止穿透到画布触发拖拽
                  e.stopPropagation();
                }}
              >
                <div className="p-2 text-neutral-400 text-xs">{d}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
