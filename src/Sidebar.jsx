import React, { useState, useEffect } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [trackers, setTrackers] = useState([]);
  const [selectedTracker, setSelectedTracker] = useState(null);
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

  const handleTrackerSelect = (tracker) => {
    setSelectedTracker(tracker); // Set the selected tracker
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
                    <p>{tracker.tracker_name}</p> {/* Display only the tracker name */}
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
                {activeTab === 'Sensors' && (
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={data}
                        syncId="anyId"
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={data}
                        syncId="anyId"
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
                        <Brush />
                      </LineChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart
                        data={data}
                        syncId="anyId"
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
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