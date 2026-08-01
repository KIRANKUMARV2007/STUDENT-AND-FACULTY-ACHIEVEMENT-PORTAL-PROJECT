import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
