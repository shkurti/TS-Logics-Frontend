import React, { useState, useEffect } from "react";
import { BsFillArchiveFill, BsGrid3X3GapFill, BsPeopleFill, BsFillGearFill } from "react-icons/bs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define a custom marker icon
const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Default Leaflet marker
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Bottom center aligns with the point
  popupAnchor: [1, -34], // Adjust popup positioning
});

// Component to adjust the map view to fit the route
function FitBounds({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds = route.map(([lat, lng]) => [lat, lng]); // Convert route to bounds
      map.fitBounds(bounds); // Adjust the map view to fit the route
    }
  }, [route, map]);

  return null;
}

function Home({ selectedTrackerId }) {
  const [route, setRoute] = useState([]); // Store the route for the selected tracker
  const [historicalData, setHistoricalData] = useState([]); // Store historical data for charts
  const [totalTrackers, setTotalTrackers] = useState(0);
  const [activeTrackers, setActiveTrackers] = useState(0);
  const [inactiveTrackers, setInactiveTrackers] = useState(0);
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    if (selectedTrackerId) {
      // Fetch historical geolocation and chart data for the selected tracker
      fetch(`https://backend-ts-68222fd8cfc0.herokuapp.com/tracker_data/${selectedTrackerId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`https error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.historical_data) {
            const geolocationData = data.historical_data
              .filter((record) => record.latitude !== "N/A" && record.longitude !== "N/A")
              .map((record) => [parseFloat(record.latitude), parseFloat(record.longitude)]); // Ensure values are numbers
            const chartData = data.historical_data.map((record) => ({
              timestamp: record.timestamp,
              temperature: record.temperature,
              battery: record.battery,
            }));
            setRoute(geolocationData);
            setHistoricalData(chartData);
          } else {
            console.warn("No historical data found for tracker:", selectedTrackerId);
            setRoute([]);
            setHistoricalData([]);
          }
        })
        .catch((error) => console.error("Error fetching geolocation data:", error));
    }
  }, [selectedTrackerId]); // Trigger when selectedTrackerId changes

  useEffect(() => {
    // WebSocket for real-time updates
    const ws = new WebSocket('wss://backend-ts-68222fd8cfc0.herokuapp.com/ws');
    ws.onopen = () => console.log('WebSocket connection established');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message); // Debug log
      if (message.operationType === 'insert' && message.data.tracker_id === selectedTrackerId) {
        const { Lat, Lng } = message.geolocation || {};
        const newRecord = message.data.historical_data?.slice(-1)[0]; // Get the latest record

        // Update the map route
        if (Lat && Lng) {
          setRoute((prevRoute) => [...prevRoute, [parseFloat(Lat), parseFloat(Lng)]]); // Append new location to the route
        }

        // Update the chart data
        if (newRecord && newRecord.timestamp && newRecord.temperature !== undefined && newRecord.battery !== undefined) {
          setHistoricalData((prevData) => {
            // Check if the new record already exists in the historical data
            const exists = prevData.some((record) => record.timestamp === newRecord.timestamp);
            if (!exists) {
              return [...prevData, newRecord]; // Append only if it doesn't already exist
            }
            return prevData; // Return the existing data if the record already exists
          });
        }
      }
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [selectedTrackerId]);

  useEffect(() => {
    // Fetch fleet metrics from the backend
    fetch('https://backend-ts-68222fd8cfc0.herokuapp.com/trackers')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`https error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const total = data.length;
        const active = data.filter((tracker) => tracker.status === 'active').length;
        const inactive = total - active;
        const totalAlerts = data.reduce((sum, tracker) => sum + (tracker.alerts || 0), 0);

        setTotalTrackers(total);
        setActiveTrackers(active);
        setInactiveTrackers(inactive);
        setAlerts(totalAlerts);
      })
      .catch((error) => console.error('Error fetching fleet metrics:', error));
  }, []);

  const handleTrackerSelection = (trackerId) => {
    setSelectedTrackerId(trackerId); // Dynamically set the selected tracker ID
  };

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 5400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Dashboard</h3>
      </div>
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Total Trackers</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{totalTrackers}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Active Trackers</h3>
            <BsGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{activeTrackers}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Inactive Trackers</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{inactiveTrackers}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Alerts</h3>
            <BsFillGearFill className="card_icon" />
          </div>
          <h1>{alerts}</h1>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={[42.798939, -74.658409]} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitBounds route={route} /> {/* Adjust the map view to fit the route */}
          {route.length > 1 ? (
            <>
              <Polyline positions={route} color="blue" />
              {/* <Marker position={route[route.length - 1]}>
                <Popup>Current Location</Popup>
              </Marker> */}
              <Marker position={route[route.length - 1]} icon={customIcon}>
                <Popup>Current Location</Popup>
              </Marker>
            </>
          ) : route.length === 1 ? (
            <Marker position={route[0]}>
              <Popup>Only one location available</Popup>
            </Marker>
          ) : (
            <p>No route data available</p>
          )}
        </MapContainer>
      </div>
      <div className="charts">
        <ResponsiveContainer width="200%" height={300}>
          <LineChart
            data={historicalData}
            margin={{
              top: 5,
              right: 0,
              left: -26,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={false} /> {/* Hide timestamps on X-axis */}
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                const { payload } = props; // Access the data point
                return [
                  `${name === "temperature" ? "Temperature" : "Battery"}: ${value}${
                    name === "temperature" ? "°C" : "%"
                  }`,
                  null, // No label for individual values
                ];
              }}
              labelFormatter={(label) => [
                `Timestamp: ${label}`, // Display timestamp first
              ]}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const timestamp = payload[0]?.payload?.timestamp || "N/A";
                const temperature = payload.find((p) => p.name === "temperature")?.value || "N/A";
                const battery = payload.find((p) => p.name === "battery")?.value || "N/A";

                return (
                  <div className="custom-tooltip">
                    <p>{`Timestamp: ${timestamp}`}</p>
                    <p>{`Temperature: ${temperature}°C`}</p>
                    <p>{`Battery: ${battery}%`}</p>
                  </div>
                );
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="battery" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;