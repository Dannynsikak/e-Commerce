import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store"; // Adjust the import according to your file structure

// ProtectedRoute component
export default function ProtectedRoute() {
  // Access userInfo from the Redux store
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // If the user is not authenticated, redirect to the login page
  if (!userInfo) {
    return <Navigate to="/signin" />;
  }

  // If authenticated, render the matched child route
  return <Outlet />;
}
