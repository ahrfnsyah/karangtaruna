"use client";

import dynamic from "next/dynamic";

import type { LocationMapViewProps } from "./location-map-view";

const LocationMapView = dynamic(
  () => import("./location-map-view").then((m) => m.LocationMapView),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center bg-muted"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-600" />
      </div>
    ),
  },
);

export function LocationMap({ className }: LocationMapViewProps) {
  return <LocationMapView className={className} />;
}