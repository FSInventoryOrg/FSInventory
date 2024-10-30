import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { useAppContext } from "./hooks/useAppContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Loading from "./pages/Loading";
import Tracker from "./pages/Tracker";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Requests from "./pages/Requests";

const App = () => {
  const { isLoggedIn, isLoading } = useAppContext();
  return (
    <>
      <Router>
        <Routes>
          {isLoading ? (
            <Route path="/" element={<Loading />} />
          ) : (
            <>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Landing />
                  )
                }
              />
              {isLoggedIn && (
                <>
                  <Route
                    path="/dashboard"
                    element={
                      <Layout>
                        <Dashboard />
                      </Layout>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <Layout>
                        <Inventory />
                      </Layout>
                    }
                  />
                  <Route
                    path="/tracker"
                    element={
                      <Layout>
                        <Tracker />
                      </Layout>
                    }
                  />
                  <Route
                    path="/tracker/:employeeCode"
                    element={
                      <Layout>
                        <Tracker />
                      </Layout>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Layout>
                        <Profile />
                      </Layout>
                    }
                  />
                  <Route
                    path="/settings/*"
                    element={
                      <Layout>
                        <Settings />
                      </Layout>
                    }
                  />
                  <Route path="/requests" element={<Layout><Requests/></Layout>} />
                </>
              )}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
};

export default App;
