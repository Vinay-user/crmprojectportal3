import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Leads from "../pages/leads/Leads";
import Contacts from "../pages/contacts/Contacts";
import Companies from "../pages/companies/Companies";
import Deals from "../pages/deals/Deals";
import Activities from "../pages/activities/Activities";
import Tasks from "../pages/tasks/Tasks";
import Calendar from "../pages/calendar/Calendar";
import Communications from "../pages/communications/Communications";
import Reports from "../pages/reports/Reports";
import Notifications from "../pages/notifications/Notifications";
import Users from "../pages/users/Users";
import Teams from "../pages/teams/Teams";
import Settings from "../pages/settings/Settings";
import Courses from "../pages/courses/Courses";
import Batches from "../pages/batches/Batches";
import Enrollments from "../pages/enrollments/Enrollments";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/enrollments" element={<Enrollments />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
