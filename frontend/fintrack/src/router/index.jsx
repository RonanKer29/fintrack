import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NewTransaction from "@/pages/NewTransaction";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions/new" element={<NewTransaction />} />
      </Routes>
    </BrowserRouter>
  );
}
