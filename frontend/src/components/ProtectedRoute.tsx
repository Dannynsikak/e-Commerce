import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// Define role-based paths
const rolePaths = {
  admin: "/admin-dashboard",
  seller: "/seller-dashboard",
  user: "/user-dashboard",
};

// ProtectedRoute component
export default function ProtectedRoute({
  roleRequired,
}: {
  roleRequired?: string;
}) {
  // Access userInfo and currentUserId from the Redux store
  const { userInfo, currentUserId } = useSelector(
    (state: RootState) => state.user
  );

  // If the user is not authenticated, redirect to the login page
  if (!userInfo || userInfo.length === 0) {
    return <Navigate to="/signin" />;
  }

  // Find the currently logged-in user based on the currentUserId
  const currentUser = userInfo.find((user) => user._id === currentUserId);

  // If currentUser is not found, redirect to sign in
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Destructure the user's role from currentUser
  const { role } = currentUser;

  // If a specific role is required for the route and the user's role doesn't match, redirect to the appropriate role dashboard
  if (roleRequired && role !== roleRequired) {
    return <Navigate to={rolePaths[role as keyof typeof rolePaths]} />;
  }

  // If authenticated and authorized, render the matched child route
  return <Outlet />;
}
