export const KARANG_TARUNA_LOCATION = {
  lat: -6.3462002,
  lon: 106.8152693,
} as const;

export const KARANG_TARUNA_LOCATION_NAME =
  "Karang Taruna RT 04 RW 08 Srengseng Sawah";

export const KARANG_TARUNA_SHORT_ADDRESS = "Jl. M. Kahfi II Gg. Masjid An-Nur";

export const KARANG_TARUNA_AREA = "";

export const KARANG_TARUNA_FULL_ADDRESS =
  "Jl. M. Kahfi II Gg. Masjid An-Nur, RT.4/RW.8, Srengseng Sawah, Kec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta 12640";

export function googleMapsUrl(query: string = KARANG_TARUNA_FULL_ADDRESS): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}