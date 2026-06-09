import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';

function OwnerLayout() {
  return (
    <div className="owner-layout">
      <Sidebar />
      <div className="owner-content">
        <Outlet />
      </div>
    </div>
  );
}

export default OwnerLayout;
