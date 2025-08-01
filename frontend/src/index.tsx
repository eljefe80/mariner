import axios from "axios";
import nullthrows from "nullthrows";
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AlertServiceProvider } from "./components/AlertServiceProvider";
import Main from "./components/Main";

const csrfToken: HTMLMetaElement = nullthrows(
  document.head.querySelector('meta[name="csrf-token"]')
) as HTMLMetaElement;

axios.defaults.headers.common["X-CSRFTOKEN"] = csrfToken.content;

const wrapper = document.getElementById("container");
const root = createRoot(wrapper!);
wrapper
  ? root.render(
      <HashRouter>
        <AlertServiceProvider>
          <Main />
        </AlertServiceProvider>
      </HashRouter>
    )
  : false;
