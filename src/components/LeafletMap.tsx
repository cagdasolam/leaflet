import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ center, zoom }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Initialize the FeatureGroup to store drawn items
      drawnItemsRef.current = new L.FeatureGroup().addTo(mapRef.current);

      // Initialize the draw control and pass it the FeatureGroup
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current,
          poly: {
            allowIntersection: false,
          },
        },
        draw: {
          polygon: true,
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
      });
      mapRef.current.addControl(drawControl);

      // Event handler for when a polygon is created
      mapRef.current.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        drawnItemsRef.current?.addLayer(layer);
        
        // Enable dragging for the entire polygon
        layer.options.draggable = true;
        layer.on('dragend', function(event) {
          console.log('Polygon dragged to:', event.target.getLatLng());
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [center, zoom]);

  return <div ref={mapContainerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default LeafletMap;
