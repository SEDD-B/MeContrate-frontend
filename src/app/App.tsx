import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import AuthPanel from "../pages/AuthPanel";
import { useAuth } from "../shared/context/AuthContext";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Layout from "../shared/layout/Layout";
import '../styles/Modal.css';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
          { !isAuthenticated ?
            (
              <Route path="/*" element={<Layout />} >
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            )
            :
            (<Route path="/" element={<AuthPanel />} />)
          }
      </Routes>
    </Router>
  )
}