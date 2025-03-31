import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsFillGeoAltFill, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify, BsChevronDown } from 'react-icons/bs';

function Header({ OpenSidebar }) {
  const [showCategories, setShowCategories] = useState(false);
  const [showShipmentsDropdown, setShowShipmentsDropdown] = useState(false);

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const toggleShipmentsDropdown = () => {
    setShowShipmentsDropdown(!showShipmentsDropdown);
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsFillGeoAltFill className="icon_header" /> TS-Logics
        <ul className="header-list">
          <li className="header-list-item" onClick={toggleShipmentsDropdown}>
            <a href="#">
              <BsGrid1X2Fill className="icon" /> Shipments <BsChevronDown className="icon" />
            </a>
            {showShipmentsDropdown && (
              <ul className="dropdown-menu">
                <li className="dropdown-item"><Link to="/shipments">All Shipments</Link></li>
                <li className="dropdown-item"><a href="#">Reports</a></li>
                <li className="dropdown-item"><a href="#">Analysis</a></li>
                <li className="dropdown-item"><a href="#">Create New Shipment</a></li>
              </ul>
            )}
          </li>
          <li className="header-list-item">
            <Link to="/trackers">
              <BsFillArchiveFill className="icon" /> Trackers
            </Link>
          </li>
          <li className="header-list-item">
            <a href="#">
              <BsFillGrid3X3GapFill className="icon" /> Configure
            </a>
          </li>
          <li className="header-list-item">
            <a href="#">
              <BsPeopleFill className="icon" /> Analytics
            </a>
          </li>
          <li className="header-list-item">
            <a href="#">
              <BsListCheck className="icon" /> Admin
            </a>
          </li>
          <li className="header-list-item">
            <Link to="/monitoring">
              <BsMenuButtonWideFill className="icon" /> Monitoring
            </Link>
          </li>
        </ul>
      </div>
      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
      <div className="categories-toggle" onClick={toggleCategories}>
        <BsJustify className="icon" />
      </div>
      <ul className={`header-list small-screen ${showCategories ? 'show' : ''}`}>
        {/* Menu items for small screens */}
        <li className="header-list-item" onClick={toggleShipmentsDropdown}>
          <a href="#">
            <BsGrid1X2Fill className="icon" /> Shipments <BsChevronDown className="icon" />
          </a>
          {showShipmentsDropdown && (
            <ul className="dropdown-menu">
              <li className="dropdown-item"><Link to="/shipments">All Shipments</Link></li>
              <li className="dropdown-item"><a href="#">Reports</a></li>
              <li className="dropdown-item"><a href="#">Analysis</a></li>
              <li className="dropdown-item"><a href="#">Create New Shipment</a></li>
            </ul>
          )}
        </li>
        <li className="header-list-item">
          <Link to="/trackers">
            <BsFillArchiveFill className="icon" /> Trackers
          </Link>
        </li>
        <li className="header-list-item">
          <a href="#">
            <BsFillGrid3X3GapFill className="icon" /> Configure
          </a>
        </li>
        <li className="header-list-item">
          <a href="#">
            <BsPeopleFill className="icon" /> Analytics
          </a>
        </li>
        <li className="header-list-item">
          <a href="#">
            <BsListCheck className="icon" /> Admin
          </a>
        </li>
        <li className="header-list-item">
          <Link to="/monitoring">
            <BsMenuButtonWideFill className="icon" /> Monitoring
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;