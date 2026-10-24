"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { t } from "@/lib/i18n";

// Leaflet builds its default marker image URLs at runtime, which breaks once
// a bundler fingerprints the files. Point it at the imported assets instead.
const src = (img) => (typeof img === "string" ? img : img.src);
const defaultIcon = L.icon({
  iconUrl: src(markerIcon),
  iconRetinaUrl: src(markerIcon2x),
  shadowUrl: src(markerShadow),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const INDIA_CENTER = [22.5, 79];

// Re-fits the view whenever the set of visible banks changes (filters).
function FitBounds({ points }) {
  const map = useMap();
  const key = points.map((p) => p.join(",")).join("|");
  const [lastKey, setLastKey] = useState(null);
  if (key !== lastKey) {
    setLastKey(key);
    if (points.length === 1) map.setView(points[0], 11);
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40] });
  }
  return null;
}

export default function BloodBankMap({ banks }) {
  const [tilesFailed, setTilesFailed] = useState(false);
  const mappable = banks.filter(
    (b) => Number.isFinite(b.lat) && Number.isFinite(b.lng)
  );
  const skipped = banks.length - mappable.length;

  if (mappable.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-600" role="status">
        {t("bloodBanks.mapNoCoordinates")}
      </p>
    );
  }

  const points = mappable.map((b) => [b.lat, b.lng]);

  return (
    <div className="mt-6">
      {tilesFailed && (
        <p
          role="alert"
          className="mb-3 rounded-md border border-brand bg-brand-light p-3 text-sm text-gray-800"
        >
          {t("bloodBanks.mapTilesError")}
        </p>
      )}
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        scrollWheelZoom={false}
        aria-label={t("bloodBanks.mapLabel")}
        className="z-0 h-96 w-full rounded-lg border border-gray-200 sm:h-[32rem]"
      >
        <TileLayer
          attribution={t("bloodBanks.mapAttribution")}
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => setTilesFailed(true),
            tileload: () => setTilesFailed(false),
          }}
        />
        <FitBounds points={points} />
        {mappable.map((bank) => (
          <Marker
            key={bank.id}
            position={[bank.lat, bank.lng]}
            icon={defaultIcon}
            title={bank.name}
            alt={bank.name}
          >
            <Popup>
              <strong>{bank.name}</strong>
              <br />
              {bank.address}
              <br />
              {t("bloodBanks.hoursLabel")}: {bank.hours}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {skipped > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {t("bloodBanks.mapSkipped", { count: skipped })}
        </p>
      )}
    </div>
  );
}
