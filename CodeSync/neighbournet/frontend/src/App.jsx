import { Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CreateRequestPage from './pages/CreateRequestPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/request/create" element={
                <ProtectedRoute>
                    <CreateRequestPage />
                </ProtectedRoute>
            } />
            <Route path="/map" element={
                <ProtectedRoute>
                    <MapPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;
