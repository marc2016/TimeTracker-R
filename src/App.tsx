import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Test from "./pages/Test";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="settings" element={<Settings />} />
        <Route path="test" element={<Test />} />
      </Route>
    </Routes>
  );
}

export default App;
