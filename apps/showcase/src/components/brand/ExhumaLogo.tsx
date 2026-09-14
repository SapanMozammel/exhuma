import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ExhumaLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

/**
 * ExhumaLogo — The Official Minimalist Brand Mark
 *
 * Visual Synthesis:
 * 1. Name: Typographic 'E'
 * 2. Meaning: 'Exhuma' (Latin: ex-humus / unearth, emerging from the ground plane into depth)
 * 3. Service: Kinetic UI card layers (3 ascending cantilevered component planes)
 * 4. Style: Tabler Icons standard (24x24 grid, 2px stroke, round caps, currentColor)
 */
export function ExhumaLogo({
  size = 24,
  className,
  strokeWidth = 2,
  ...props
}: ExhumaLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('tabler-icon tabler-icon-brand-exhuma transition-transform duration-200 group-hover:scale-105', className)}
      {...props}
    >
      {/* Ground horizon / surface from which components are un-earthed */}
      <path d="M3 20h18" />
      {/* Vertical kinetic elevation spine */}
      <path d="M7 20v-14" />
      {/* 3 cantilevered UI component layers forming the letter 'E' */}
      <path d="M7 6h10" />
      <path d="M7 11h6" />
      <path d="M7 16h10" />
      {/* Upward kinetic lift / exhumation vector */}
      <path d="M14 4l3 2l-3 2" />
    </svg>
  );
}

export default ExhumaLogo;
