import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { store } from "./stores/store.js";
import App from "./App.jsx";
import { checkAuth } from "./features/auth/authSlice.js";

const Root = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Silent auth check - doesn't show errors to user
    dispatch(checkAuth()).catch(() => {
      // Silently fail - user just isn't logged in
      console.log("User not authenticated");
    });
  }, [dispatch]);

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Root />
  </Provider>
);
