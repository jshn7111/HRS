import { Navigate } from 'react-router-dom';

function AdminRoute({ children, isAdmin }) {
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AdminRoute;
