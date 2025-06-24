import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NewTransaction from "@/pages/NewTransaction";
import Portfolios from "@/pages/Portfolios";
import PortfolioDetail from "@/pages/PortfolioDetail";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolios"
          element={
            <ProtectedRoute>
              <Portfolios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolios/:id"
          element={
            <ProtectedRoute>
              <PortfolioDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/new"
          element={
            <ProtectedRoute>
              <NewTransaction />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
