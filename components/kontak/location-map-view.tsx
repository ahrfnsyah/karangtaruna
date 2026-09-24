"use client";

import { useEffect } from "react";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import {
  KARANG_TARUNA_LOCATION,
  KARANG_TARUNA_LOCATION_NAME,
} from "@/lib/location";
import { cn } from "@/lib/utils";

const pinIcon = L.divIcon({
  className: "karang-taruna-marker",
  html: `
    <span role="img" aria-label="${KARANG_TARUNA_LOCATION_NAME}">
      <svg width="34" height="44" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 0C7.86 0 4.5 3.36 4.5 7.5 4.5 13.13 12 24 12 24S19.5 13.13 19.5 7.5C19.5 3.36 16.14 0 12 0z"
          fill="#2c6b53"
          stroke="#1e3a31"
          stroke-width="0.5"
        />
        <circle cx="12" cy="7.5" r="3.2" fill="#ffffff" />
        <circle cx="12" cy="7.5" r="1.6" fill="#2c6b53" />
      </svg>
    </span>
  `,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -40],
});

function MapResize() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

export type LocationMapViewProps = {
  className?: string;
};

export function LocationMapView({ className }: LocationMapViewProps) {
  return (
    <div
      role="region"
      aria-label="Peta lokasi Karang Taruna RT 04 RW 08, Srengseng Sawah"
      className={cn("relative z-0", className)}
    >
      <MapContainer
        center={[KARANG_TARUNA_LOCATION.lat, KARANG_TARUNA_LOCATION.lon]}
        zoom={16}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[KARANG_TARUNA_LOCATION.lat, KARANG_TARUNA_LOCATION.lon]}
          icon={pinIcon}
        >
          <Popup>{KARANG_TARUNA_LOCATION_NAME}</Popup>
        </Marker>
        <MapResize />
      </MapContainer>
    </div>
  );
}