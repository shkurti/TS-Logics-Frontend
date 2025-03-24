import React, { useState, useEffect } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Sidebar({ isCollapsed, toggleSidebar, setSelectedTrackerId }) {
  const [trackers, setTrackers] = useState([]);
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [historicalData, setHistoricalData] = useState([]); // State for historical data
  const [activeTab, setActiveTab] = useState('Details'); // Track the active tab

  useEffect(() => {
    // Fetch the list of registered trackers
    fetch('http://localhost:8000/trackers')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTrackers(data))
      .catch((error) => console.error('Error fetching trackers:', error));
  }, []);

  useEffect(() => {
    // WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onopen = () => console.log('WebSocket connection established');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message); // Debug log
      if (message.operationType === 'insert') {
        const { tracker_id, historical_data } = message.data;

        // Update the tracker list dynamically
        setTrackers((prevTrackers) => {
          const trackerExists = prevTrackers.some((tracker) => tracker.tracker_id === tracker_id);
          if (!trackerExists) {
            return [...prevTrackers, message.data];
          }
          return prevTrackers.map((tracker) =>
            tracker.tracker_id === tracker_id ? message.data : tracker
          );
        });

        // Append real-time data to the historical data if the tracker is selected
        if (selectedTracker?.tracker_id === tracker_id && historical_data) {
          const newRecords = historical_data.filter((record) => {
            // Check if the record already exists in the historical data
            return !historicalData.some((existingRecord) => existingRecord.timestamp === record.timestamp);
          });

          setHistoricalData((prevData) => [...prevData, ...newRecords]); // Append only new records
        }
      }
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [selectedTracker, historicalData]);

  const handleTrackerSelect = (tracker) => {
    setSelectedTracker(tracker); // Set the selected tracker
    setSelectedTrackerId(tracker.tracker_id); // Update the selected tracker ID in App state
    fetch(`http://localhost:8000/tracker_data/${tracker.tracker_id}`) // Fetch historical data
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.historical_data) {
          setHistoricalData(data.historical_data);
        } else {
          console.warn('No historical data found for tracker:', tracker.tracker_id);
          setHistoricalData([]);
        }
      })
      .catch((error) => console.error('Error fetching historical data:', error));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab
  };

  return (
    <div className="sidebar-container">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {!isCollapsed && (
          <>
            <div className="tracker-list-wrapper">
              <div className="tracker-list-header">
                <h3>Registered Trackers</h3>
              </div>
              <div className="tracker-list-scrollable">
                {trackers.map((tracker) => (
                  <div
                    key={tracker.tracker_id}
                    className={`tracker-item ${selectedTracker?.tracker_id === tracker.tracker_id ? 'selected' : ''}`}
                    onClick={() => handleTrackerSelect(tracker)}
                  >
                    <p>{tracker.tracker_name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="tab-navigation">
              <ul className="tab-list">
                <li
                  className={`tab-item ${activeTab === 'Details' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Details')}
                >
                  Details
                </li>
                <li
                  className={`tab-item ${activeTab === 'Sensors' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Sensors')}
                >
                  Sensors
                </li>
                <li
                  className={`tab-item ${activeTab === 'Alerts' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Alerts')}
                >
                  Alerts
                </li>
                <li
                  className={`tab-item ${activeTab === 'Reports' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Reports')}
                >
                  Reports
                </li>
              </ul>
              <div className="tab-content">
                {activeTab === 'Details' && selectedTracker && (
                  <div>
                    <p><strong>Selected Tracker:</strong> {selectedTracker.tracker_name}</p>
                    <p><strong>Tracker ID:</strong> {selectedTracker.tracker_id}</p>
                    <p><strong>Device Type:</strong> {selectedTracker.device_type}</p>
                    <p><strong>Model:</strong> {selectedTracker.model_number}</p>
                  </div>
                )}
                {activeTab === 'Sensors' && historicalData.length > 0 ? (
                  <div>
                    <h4>Temperature Over Time</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={historicalData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: -30, // Increase left margin
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={false} /> {/* Remove timestamps from X-axis */}
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                    <h4>Battery Level Over Time</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={historicalData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: -30, // Increase left margin
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tick={false} /> {/* Remove timestamps from X-axis */}
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="battery" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  activeTab === 'Sensors' && <p>No sensor data available for this tracker.</p>
                )}
                {activeTab === 'Alerts' && <div>Alerts content</div>}
                {activeTab === 'Reports' && <div>Reports content</div>}
              </div>
            </div>
          </>
        )}
      </aside>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <BsArrowRight className="icon" /> : <BsArrowLeft className="icon" />}
      </div>
    </div>
  );
}

export default Sidebar;