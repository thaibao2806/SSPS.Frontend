import React from 'react'
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRoute from './routes/AppRoute.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js'

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
    </PersistGate>
  </Provider>,
);

serviceWorkerRegistration.register();
