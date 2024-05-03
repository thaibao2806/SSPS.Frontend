import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../../scenes/global/Topbar";
import Sidebar from "../../scenes/global/Sidebar";
import Dashboard from "../../scenes/dashboard";
import Team from "../../scenes/team";
import Invoices from "../../scenes/invoices";
import Contacts from "../../scenes/contacts";
import Bar from "../../scenes/bar";
import Form from "../../scenes/form";
import Account from "../../scenes/update_account";
import Line from "../../scenes/line";
import Pie from "../../scenes/pie";
import FAQ from "../../scenes/faq";
import Geography from "../../scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import Calendar from "../../scenes/calendar/calendar";
import NotFound from "../../routes/NotFound";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode"; 

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [role, setRole] = useState("")
  const user = useSelector((state) => state.auth.login?.currentUser)

  useEffect(() => {
    if (user) {
      const decode = jwt_decode(user?.data.accessToken);
      console.log(decode?.firstName);
      setRole(decode?.role)
    }
  }, []);

  return (
    <>
      {role === "ADMIN" || role === "admin" ? (
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <Sidebar />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* <Route path="/team" element={<Team />} /> */}
                  <Route path="/manage-user" element={<Contacts />} />
                  {/* <Route path="/invoices" element={<Invoices />} /> */}
                  <Route path="/form" element={<Form />} />
                  <Route path="/update-account" element={<Account />} />
                  {/* <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} /> */}
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      ) : (
        <>
          <NotFound />
        </>
      )}
    </>
  );
}

export default App;
