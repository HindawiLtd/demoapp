import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app"
import registerServiceWorker from "./registerServiceWorker"
import { Provider } from "react-redux"
import { configureStore } from "./store/configure-store"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/css/bootstrap-theme.css"

const store = configureStore()

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root"),
)
registerServiceWorker()
