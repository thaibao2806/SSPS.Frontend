import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../../scenes/global/Topbar";
import Sidebar from "../../scenes/global/Sidebar";
import Dashboard from "../../scenes/dashboard";
import Contacts from "../../scenes/contacts";
import Form from "../../scenes/form";
import Account from "../../scenes/update_account";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import Calendar from "../../scenes/calendar/calendar";
import NotFound from "../../routes/NotFound";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import ChatAIAdmin from "../../scenes/chat";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [role, setRole] = useState("");
  const user = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    if (user) {
      const decode = jwt_decode(user?.data.accessToken);
      console.log(decode?.firstName);
      setRole(decode?.role);
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
                  <Route path="/manage-user" element={<Contacts />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/update-account" element={<Account />} />
                </Routes>
                <div className="chat-ai-button-admin">
                  <ChatAIAdmin />
                </div>
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
