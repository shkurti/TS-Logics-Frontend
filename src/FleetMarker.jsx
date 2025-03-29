import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define a custom icon for the fleet marker
const createCustomIcon = (status) => {
  const iconUrl = {
    active: 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png', // Green truck icon
    idle: 'https://cdn-icons-png.flaticon.com/512/1946/1946489.png', // Yellow truck icon
    stopped: 'https://cdn-icons-png.flaticon.com/512/1946/1946490.png', // Red truck icon
  }[status] || 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png'; // Default to active

  return new L.Icon({
    iconUrl,
    iconSize: [30, 40], // Adjust size as needed
    iconAnchor: [15, 40], // Anchor the icon to its base
    popupAnchor: [0, -40], // Position the popup above the icon
  });
};

function FleetMarker({ position, vehicle }) {
  const { id, name, status, speed, battery, lastUpdated } = vehicle;

  return (
    <Marker position={position} icon={createCustomIcon(status)}>
      <Popup>
        <div style={{ textAlign: 'center' }}>
          <strong>{name}</strong> (ID: {id})<br />
          <span>Status: {status}</span><br />
          <span>Speed: {speed} km/h</span><br />
          <span>Battery: {battery}%</span><br />
          <span>Last Updated: {lastUpdated}</span>
        </div>
      </Popup>
    </Marker>
  );
}

export default FleetMarker;
