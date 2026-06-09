import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
