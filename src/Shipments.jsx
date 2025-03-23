import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import 'leaflet/dist/leaflet.css';

function Shipments() {
  const [activeTab, setActiveTab] = useState('In Transit');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [legs, setLegs] = useState([{ id: 1 }]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleLeftPanel = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleShipmentClick = (shipment) => {
    setSelectedShipment(shipment);
  };

  const handleBackToList = () => {
    setSelectedShipment(null);
  };

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setLegs([{ id: 1 }]);
  };

  const handleAddLeg = () => {
    setLegs([...legs, { id: legs.length + 1 }]);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Add logic to handle form submission
    setShowForm(false);
    setLegs([{ id: 1 }]);
  };

  const shipments = [
    {
      id: 'SOT-1059',
      shipFrom: 'Shake Shack',
      shipTo: 'Fresh Thyme DC',
      eta: '2023-10-15 14:00',
      updatedTimestamp: 'Updated 3 days ago',
      completionDate: 'Nov 20, 2022, 06:00:00 AM',
      transitTime: '4 days, 19 hours'
    },
    // Add more shipments as needed
  ];

  return (
    <main className="shipments-container">
      <div className={`left-panel ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="left-panel-toggle" onClick={toggleLeftPanel}>
          {isCollapsed ? <BsArrowRight className="icon" /> : <BsArrowLeft className="icon" />}
        </div>
        {!isCollapsed && (
          <>
            {showForm ? (
              <form className="shipment-form" onSubmit={handleSubmitForm}>
                <h2>Create New Shipment</h2>
                {legs.map((leg, index) => (
                  <div key={leg.id} className="leg-section">
                    <h3>Leg {index + 1}</h3>
                    <div className="form-group">
                      <label htmlFor={`shipFrom-${leg.id}`}>Ship From Address</label>
                      <input type="text" id={`shipFrom-${leg.id}`} name={`shipFrom-${leg.id}`} placeholder="Enter ship from address" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`shipDate-${leg.id}`}>Ship Date</label>
                      <input type="datetime-local" id={`shipDate-${leg.id}`} name={`shipDate-${leg.id}`} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`alertPresets-${leg.id}`}>Alert Presets</label>
                      <select id={`alertPresets-${leg.id}`} name={`alertPresets-${leg.id}`}>
                        <option value="">Select alert presets</option>
                        <option value="temperature">Temperature Alert</option>
                        <option value="location">Location Alert</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`mode-${leg.id}`}>Mode</label>
                      <select id={`mode-${leg.id}`} name={`mode-${leg.id}`} required>
                        <option value="">Select mode</option>
                        <option value="road">Road</option>
                        <option value="air">Air</option>
                        <option value="sea">Sea</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`carrier-${leg.id}`}>Carrier</label>
                      <input type="text" id={`carrier-${leg.id}`} name={`carrier-${leg.id}`} placeholder="Enter carrier name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`stopAddress-${leg.id}`}>Stop Address</label>
                      <input type="text" id={`stopAddress-${leg.id}`} name={`stopAddress-${leg.id}`} placeholder="Enter stop address" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`arrivalDate-${leg.id}`}>Arrival Date</label>
                      <input type="datetime-local" id={`arrivalDate-${leg.id}`} name={`arrivalDate-${leg.id}`} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`shipTo-${leg.id}`}>Ship To Address</label>
                      <input type="text" id={`shipTo-${leg.id}`} name={`shipTo-${leg.id}`} placeholder="Enter final destination address" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`deliveryDate-${leg.id}`}>Delivery Date</label>
                      <input type="datetime-local" id={`deliveryDate-${leg.id}`} name={`deliveryDate-${leg.id}`} required />
                    </div>
                    {leg.mode === 'air' && (
                      <div className="form-group">
                        <label htmlFor={`awb-${leg.id}`}>AWB (Air Waybill)</label>
                        <input type="text" id={`awb-${leg.id}`} name={`awb-${leg.id}`} placeholder="Enter AWB number" />
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor={`geofence-${leg.id}`}>Geofence Alert</label>
                      <select id={`geofence-${leg.id}`} name={`geofence-${leg.id}`}>
                        <option value="">Select geofence alert</option>
                        <option value="entry">Entry Alert</option>
                        <option value="exit">Exit Alert</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-leg-button" onClick={handleAddLeg}>Add Stop</button>

                  <button type="button" className="cancel-button" onClick={handleCancelForm}>Cancel</button>
                  <button type="submit" className="submit-button">Submit</button>

              </form>
            ) : (
              <>
                {!selectedShipment ? (
                  <div className="panel-header">
                    <h2>Shipments</h2>
                    <button className="create-button" onClick={handleCreateClick}>Create New Shipments</button>
                  </div>
                ) : (
                  <button onClick={handleBackToList}>Back to List</button>
                )}
                {selectedShipment ? (
                  <div className="sidebar-container">
                    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                      <div className="shipment-details">
                        <p><strong>Shipment ID:</strong> {selectedShipment.id}</p>
                        <p><strong>Updated Timestamp:</strong> {selectedShipment.updatedTimestamp}</p>
                        <p><strong>Ship From:</strong> {selectedShipment.shipFrom}</p>
                        <p><strong>Ship To:</strong> {selectedShipment.shipTo}</p>
                        <p><strong>Completion Date:</strong> {selectedShipment.completionDate}</p>
                        <p><strong>Transit Time:</strong> {selectedShipment.transitTime}</p>
                      </div>
                      <div className="tab-navigation">
                        <ul className="tab-list">
                          <li className={`tab-item ${activeTab === 'Sensors' ? 'active' : ''}`} onClick={() => handleTabClick('Sensors')}>Sensors</li>
                          <li className={`tab-item ${activeTab === 'Alerts' ? 'active' : ''}`} onClick={() => handleTabClick('Alerts')}>Alerts</li>
                          <li className={`tab-item ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => handleTabClick('Reports')}>Reports</li>
                          <li className={`tab-item ${activeTab === 'Details' ? 'active' : ''}`} onClick={() => handleTabClick('Details')}>Details</li>
                        </ul>
                        <div className="tab-content">
                          {activeTab === 'Sensors' && <div>Sensors content</div>}
                          {activeTab === 'Alerts' && <div>Alerts content</div>}
                          {activeTab === 'Reports' && <div>Reports content</div>}
                          {activeTab === 'Details' && <div>Details content</div>}
                        </div>
                      </div>
                    </aside>
                  </div>
                ) : (
                  <>
                    <div className="search-bar">
                      <input type="text" placeholder="Search shipments..." />
                    </div>
                    <div className="tabs">
                      <button className={`tab ${activeTab === 'In Transit' ? 'active' : ''}`} onClick={() => handleTabClick('In Transit')}>In Transit (152)</button>
                      <button className={`tab ${activeTab === 'Upcoming' ? 'active' : ''}`} onClick={() => handleTabClick('Upcoming')}>Upcoming (8)</button>
                      <button className={`tab ${activeTab === 'Completed' ? 'active' : ''}`} onClick={() => handleTabClick('Completed')}>Completed (481)</button>
                    </div>
                    <div className="dropdowns">
                      <select>
                        <option value="">Filter by Ship From</option>
                        <option value="Shake Shack">Shake Shack</option>
                        {/* Add more options as needed */}
                      </select>
                      <select>
                        <option value="">Filter by Ship To</option>
                        <option value="Fresh Thyme DC">Fresh Thyme DC</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                    <div className="shipments-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Shipment ID</th>
                            <th>Ship From</th>
                            <th>Ship To</th>
                            <th>ETA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shipments.map((shipment) => (
                            <tr key={shipment.id} onClick={() => handleShipmentClick(shipment)}>
                              <td>{shipment.id}</td>
                              <td>{shipment.shipFrom}</td>
                              <td>{shipment.shipTo}</td>
                              <td>{shipment.eta}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className="shipments-map-container">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100vw" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              SOT-1059 in Germany
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </main>
  );
}

export default Shipments;
