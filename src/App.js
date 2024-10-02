import "./App.css";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { SearchPage } from "./components/SearchPage";

function App() {
  return (
    <Routes>
      <Route Component={MainPage} path="/" />
      <Route Component={SearchPage} path="/search" />
    </Routes>
  );
}

export default App;
