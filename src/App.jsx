import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './Home';
import Sidebar from './Sidebar';
import Shipments from './Shipments';
import Trackers from './Trackers';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Router>
      <div className={`grid-container ${isCollapsed ? 'collapsed' : ''}`}>
        <Header OpenSidebar={OpenSidebar} />
        <Routes>
          <Route path="/" element={<><Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} /><Home /></>} />
          <Route path="/monitoring" element={<><Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} /><Home /></>} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/trackers" element={<Trackers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
