'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  SAMPLE_LOCATIONS,
  CATEGORIES,
  type ItemCategory,
  type Location,
} from '../data/outbound-locations';

const BIOMES = [
  { id: 'starting-level', label: 'Starting Level', image: 'map-starting-level.png' },
  { id: 'canyons', label: 'Canyons', image: 'map-canyons.png' },
  { id: 'mountains', label: 'Mountains', image: 'map-mountains.png' },
  { id: 'pacific-coast', label: 'Pacific Coast', image: 'map-pacific-coast.png' },
];

export function OutboundMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const imageOverlayRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedBiome, setSelectedBiome] = useState('starting-level');
  
  const [visibleCategories, setVisibleCategories] = useState<Set<ItemCategory>>(
    new Set(['equipment', 'consumable', 'collectible', 'resource', 'waypoint'])
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Filter locations based on visible categories
  const filteredLocations = useMemo(
    () => SAMPLE_LOCATIONS.filter((loc) => visibleCategories.has(loc.category)),
    [visibleCategories]
  );

  // Initialize map - only on client side
  useEffect(() => {
    if (!mapContainer.current || typeof window === 'undefined') return;

    // Dynamically import Leaflet only on client
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      // Initialize map with custom CRS
      const map = L.map(mapContainer.current!, {
        crs: L.CRS.Simple,
        center: [500, 500],
        zoom: 2,
        minZoom: 0,
        maxZoom: 4,
      });

      // Set bounds
      const bounds = L.latLngBounds([
        [0, 0],
        [1000, 1000],
      ]);
      map.fitBounds(bounds);

      // Add initial image overlay (game map)
      const currentBiome = BIOMES.find((b) => b.id === selectedBiome);
      const imageOverlay = L.imageOverlay(
        `/${currentBiome?.image}`,
        bounds,
        {
          opacity: 0.3,
          interactive: false,
        }
      ).addTo(map);
      imageOverlayRef.current = imageOverlay;

    //   // Add fallback tile layer
    //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; OpenStreetMap contributors',
    //     opacity: 0.5,
    //   }).addTo(map);

      mapInstance.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update image overlay when biome changes
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    import('leaflet').then((L) => {
      const map = mapInstance.current;
      const bounds = L.latLngBounds([
        [0, 0],
        [1000, 1000],
      ]);

      // Remove old overlay
      if (imageOverlayRef.current) {
        map.removeLayer(imageOverlayRef.current);
      }

      // Add new overlay
      const currentBiome = BIOMES.find((b) => b.id === selectedBiome);
      const imageOverlay = L.imageOverlay(
        `/${currentBiome?.image}`,
        bounds,
        {
          opacity: 0.3,
          interactive: false,
        }
      ).addTo(map);
      imageOverlayRef.current = imageOverlay;
    });
  }, [selectedBiome, mapReady]);

  // Update markers when visible categories change or map is ready
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    import('leaflet').then((L) => {
      const map = mapInstance.current;

      // Clear all markers
      markersRef.current.forEach((marker) => {
        map.removeLayer(marker);
      });
      markersRef.current.clear();

      // Add filtered markers
      filteredLocations.forEach((location) => {
        const category = CATEGORIES[location.category];
        
        // Create custom marker icon
        const icon = L.icon({
          iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" width="25" height="41"><path fill="${encodeURIComponent(category.color)}" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.2 12.5 28.1 12.5 28.1S25 20.7 25 12.5 19.4 0 12.5 0z"/></svg>`,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });

        const marker = L.marker([location.y, location.x], { icon })
          .bindPopup(`
            <div style="width: 200px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 24px;">${location.icon || '📍'}</span>
                <div>
                  <h3 style="margin: 0; font-weight: bold; color: #111;">${location.name}</h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">${category.label}</p>
                </div>
              </div>
              <p style="margin: 0; font-size: 14px; color: #333;">${location.description}</p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #999;">Coordinates: (${location.x}, ${location.y})</p>
            </div>
          `)
          .addTo(map);

        markersRef.current.set(location.id, marker);
      });
    });
  }, [filteredLocations, mapReady]);

  const toggleCategory = (category: ItemCategory) => {
    const updated = new Set(visibleCategories);
    if (updated.has(category)) {
      updated.delete(category);
    } else {
      updated.add(category);
    }
    setVisibleCategories(updated);
  };

  return (
    <div className="flex h-screen gap-4 bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 overflow-y-auto border-r border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Outbound Map
        </h1>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Select a biome and toggle layers to explore.
        </p>

        {/* Biome selector */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Biomes
          </h2>
          <div className="space-y-2">
            {BIOMES.map((biome) => (
              <button
                key={biome.id}
                onClick={() => setSelectedBiome(biome.id)}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedBiome === biome.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {biome.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layer toggles */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Layers
          </h2>
          <div className="space-y-2">
            {(Object.entries(CATEGORIES) as [ItemCategory, (typeof CATEGORIES)[ItemCategory]][]).map(
              ([category, meta]) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleCategories.has(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {meta.label}
                  </span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {SAMPLE_LOCATIONS.filter((l) => l.category === category).length}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Locations list */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Locations ({filteredLocations.length})
          </h2>
          <div className="space-y-2">
            {filteredLocations.map((location) => {
              const cat = CATEGORIES[location.category];
              const isSelected = selectedLocation === location.id;
              return (
                <div
                  key={location.id}
                  onClick={() => {
                    setSelectedLocation(location.id);
                    const marker = markersRef.current.get(location.id);
                    if (marker && mapInstance.current && mapReady) {
                      mapInstance.current.setView([location.y, location.x], 3);
                      marker.openPopup();
                    }
                  }}
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{location.icon || '📍'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {location.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {location.description}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        ></span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {cat.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1" ref={mapContainer} />

    </div>
  );
}

