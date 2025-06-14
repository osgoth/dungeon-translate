import { Provider } from "react-redux";
import "./App.css";
import Routes from "./config/routes/routes";
import { persistor, store } from "./config/redux/store";
import { PersistGate } from "redux-persist/integration/react";


function App() {
  return <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <div className="p-0 m-0">
          <Routes />
        </div>
      </PersistGate>
    </Provider>
  </>;
}

export default App;
