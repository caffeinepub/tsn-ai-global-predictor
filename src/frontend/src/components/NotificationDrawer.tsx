import React from "react";
import { X, Bell } from "lucide-react";
import { useRecentNotifications } from "../hooks/useQueries";
import { getSportIcon, formatTimeAgo } from "../utils/helpers";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { data: notifications = [], isLoading } = useRecentNotifications();

  if (!isOpen) return null;

  const sorted = [...notifications].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm w-full h-full cursor-default"
        onClick={onClose}
        aria-label="Close notifications"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[160] animate-notif-slide"
        style={{ maxHeight: "70dvh" }}
      >
        <div className="m-3 rounded-2xl border border-sport-border bg-sport-card shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sport-border">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              <span className="font-heading font-bold text-base text-sport-text">Notifications</span>
              {notifications.length > 0 && (
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                  {notifications.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-sport-surface hover:bg-sport-border transition-colors"
              aria-label="Close notifications"
            >
              <X size={16} className="text-sport-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(70dvh - 70px)" }}>
            {isLoading ? (
              <div className="p-4 space-y-3">
                {["n1", "n2", "n3"].map((k) => (
                  <div key={k} className="h-16 rounded-lg skeleton-shimmer" />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-sport-muted">
                <Bell size={32} className="mb-3 opacity-30" />
                <p className="text-sm font-heading">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-sport-border">
                {sorted.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3 p-4">
                    <div                   className="shrink-0 w-9 h-9 rounded-xl bg-sport-surface flex items-center justify-center text-base">
                      {getSportIcon(notif.sport)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-sm text-sport-text leading-snug">
                        {notif.title}
                      </p>
                      <p className="text-xs text-sport-muted mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    <span className="text-xs text-sport-muted shrink-0 mt-0.5">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
