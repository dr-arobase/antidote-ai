import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => (
  <div className="layout">
    <Navbar />
    <main className="layout__main">
      <Outlet />
    </main>
  </div>
);

export default Layout;
