import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FormSkeletonOverlayProps {
  isVisible: boolean;
  type?: 'card' | 'userid' | 'upload' | 'banklain';
  message?: string;
}

export const FormSkeletonOverlay: React.FC<FormSkeletonOverlayProps> = ({
  isVisible,
  type = 'card',
  message = 'Mengamankan & memproses data...',
}) => {
  if (!isVisible) return null;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="absolute inset-0 z-30 bg-[#f4f7fa]/92 backdrop-blur-[2px] rounded-xl p-3 flex flex-col justify-start space-y-3.5 animate-in fade-in duration-200 pointer-events-auto select-none border border-slate-200/80 shadow-inner"
    >
      {/* Top Security & Processing Status Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/90">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-[#0c3b68] border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-[12px] font-bold text-[#0c3b68] tracking-tight">
            {message}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <ShieldCheck size={11} className="shrink-0" />
          <span>BCA Secure</span>
        </div>
      </div>

      {/* Field Skeletons according to form type */}
      {type === 'banklain' && (
        <div className="space-y-1">
          <div className="h-3 w-28 rounded animate-skeleton-shimmer" />
          <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
        </div>
      )}

      {type === 'card' || type === 'banklain' ? (
        <>
          {/* Card Number Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-32 rounded animate-skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
          </div>

          {/* 2-Column Grid: Expiry & CVV */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <div className="h-3 w-20 rounded animate-skeleton-shimmer" />
              <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
            </div>
            <div className="space-y-1">
              <div className="h-3 w-20 rounded animate-skeleton-shimmer" />
              <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
            </div>
          </div>

          {/* Phone Number Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-36 rounded animate-skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
          </div>

          {/* Balance / Limit Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-32 rounded animate-skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
          </div>
        </>
      ) : type === 'userid' ? (
        <>
          {/* User ID Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-28 rounded animate-skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
          </div>

          {/* Phone Number Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-36 rounded animate-skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
          </div>

          {/* PIN / KeyBCA Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-32 rounded animate-skeleton-shimmer" />
            <div className="h-10 w-full rounded-lg animate-skeleton-shimmer" />
          </div>
        </>
      ) : (
        <>
          {/* Upload Dropzone Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-32 rounded animate-skeleton-shimmer" />
            <div className="h-28 w-full rounded-xl animate-skeleton-shimmer" />
          </div>

          {/* Notes / Textarea Skeleton */}
          <div className="space-y-1">
            <div className="h-3 w-36 rounded animate-skeleton-shimmer" />
            <div className="h-16 w-full rounded-lg animate-skeleton-shimmer" />
          </div>
        </>
      )}

      {/* Action Buttons Skeleton */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="h-10 rounded-lg animate-skeleton-shimmer" />
        <div className="h-10 rounded-lg animate-skeleton-shimmer" />
      </div>
    </div>
  );
};
