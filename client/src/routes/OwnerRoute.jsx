import { Navigate } from 'react-router-dom';

function OwnerRoute({ children, isOwner }) {
  if (!isOwner) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default OwnerRoute;
