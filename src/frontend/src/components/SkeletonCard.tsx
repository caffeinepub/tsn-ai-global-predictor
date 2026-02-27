import React from "react";

interface SkeletonCardProps {
  lines?: number;
  height?: number;
}

export function SkeletonCard({ lines = 3, height = 120 }: SkeletonCardProps) {
  return (
    <div
      className="rounded-xl border border-sport-border bg-sport-card p-4 overflow-hidden"
      style={{ minHeight: height }}
    >
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 rounded-full skeleton-shimmer" />
          <div className="ml-auto h-4 w-12 rounded-full skeleton-shimmer" />
        </div>
        {Array.from({ length: lines }, (_, i) => ({ id: `skel-${i}`, w1: `${60 + i * 10}%`, w2: `${40 + i * 5}%` })).map((row) => (
          <div key={row.id} className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded skeleton-shimmer" style={{ width: row.w1 }} />
              <div className="h-3 rounded skeleton-shimmer" style={{ width: row.w2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonText({ width = "100%", height = 14 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="rounded skeleton-shimmer"
      style={{ width, height }}
    />
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => `sk-${i}`).map((id) => (
        <SkeletonCard key={id} height={100} lines={2} />
      ))}
    </div>
  );
}
