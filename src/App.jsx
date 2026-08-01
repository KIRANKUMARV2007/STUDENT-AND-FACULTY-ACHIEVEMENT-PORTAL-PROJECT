import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Leaderboard from './pages/Leaderboard';
import StudentSearch from './pages/StudentSearch';
import RewardPoints from './pages/RewardPoints';
import MyAchievements from './pages/MyAchievements';
import Dashboard from './pages/Dashboard';
import StudentAchievementForm from './pages/StudentAchievementForm';
import AchievementDetail from './pages/AchievementDetail';
import Notifications from './pages/Notifications';
import PublicProfile from './pages/PublicProfile';
import Settings from './pages/Settings';
import StudentDashboard from './pages/StudentDashboard';
// Admin and Faculty Modules
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/my-achievements" element={<MyAchievements />} />
            <Route path="/add-achievement" element={<StudentAchievementForm />} />
            <Route path="/achievement/:id" element={<AchievementDetail />} />
            <Route path="/reward-points" element={<RewardPoints />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/student-search" element={<StudentSearch />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Faculty Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="faculty" />}>
          <Route path="/faculty-dashboard" element={<FacultyLayout />} />
          <Route path="/faculty-approvals" element={<FacultyLayout />} />
          <Route path="/faculty-verified" element={<FacultyLayout />} />
          <Route path="/faculty-students" element={<FacultyLayout />} />
          <Route path="/faculty-analytics" element={<FacultyLayout />} />
          <Route path="/faculty-reports" element={<FacultyLayout />} />
          <Route path="/faculty-notifications" element={<FacultyLayout />} />
          <Route path="/faculty-profile" element={<FacultyLayout />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin-dashboard" element={<AdminLayout />} />
          <Route path="/admin-users" element={<AdminLayout />} />
          <Route path="/admin-students" element={<AdminLayout />} />
          <Route path="/admin-faculty" element={<AdminLayout />} />
          <Route path="/admin-reports" element={<AdminLayout />} />
          <Route path="/admin-verifications" element={<AdminLayout />} />
          <Route path="/admin-reward-rules" element={<AdminLayout />} />
          <Route path="/admin-departments" element={<AdminLayout />} />
          <Route path="/admin-notifications" element={<AdminLayout />} />
          <Route path="/admin-settings" element={<AdminLayout />} />
          <Route path="/admin-categories" element={<AdminLayout />} />
          <Route path="/admin-announcements" element={<AdminLayout />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
