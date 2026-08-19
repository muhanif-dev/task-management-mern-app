import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignupPage } from './pages/SignupPage';
import { SigninPage } from './pages/SigninPage';

// Placeholder for tasks page until Phase 12
const TasksPage = () => <div className="p-8 text-center text-xl font-bold">Tasks Dashboard Placeholder</div>;

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;