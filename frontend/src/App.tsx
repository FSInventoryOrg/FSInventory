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
              <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Landing />} />
              {isLoggedIn && (
                <>
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
                  <Route path="/tracker" element={<Layout><Tracker /></Layout>} />
                  <Route path="/employee/:employeeCode" element={<Layout><Tracker /></Layout>} />
                  {/* <Route path="/metrics" element={<Layout><Metrics /></Layout>} />
                  <Route path="/requests" element={<Layout>Requests</Layout>} /> */}
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
