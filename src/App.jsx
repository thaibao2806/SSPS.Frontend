import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./pages/user/global/Topbar";
import Sidebar from "./pages/user/global/Sidebar";
import Dashboard from "./pages/user/dashboard";
import Team from "./pages/user/team";
import Invoices from "./pages/user/invoices";
import Contacts from "./pages/user/contacts";
import Bar from "./pages/user/bar";
import Form from "./pages/user/form";
import Line from "./pages/user/line";
import Pie from "./pages/user/pie";
import FAQ from "./pages/user/faq";
import Board from "./pages/user/board/Board";
import Geography from "./pages/user/geography";
import UpdateAccount from "./pages/user/update_account";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./pages/user/calendar/calendar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar
            className="sidebar"
            isSidebar={isSidebar}
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
          />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} toggleSidebar={toggleSidebar} />
            <div style={{ paddingLeft: "70px" }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} /> */}
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/todo" element={<Board />} />
                <Route path="/" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/update-account" element={<UpdateAccount />} />
              </Routes>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
