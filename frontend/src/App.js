import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./components/screens/LandingPage/LandingPage";
import MyNotes from "./components/screens/MyNotes/MyNotes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./components/screens/LoginScreen/LoginScreen";
import Registerscreen from "./components/screens/RegisterScreeen/Registerscreen";

const App = () => (
  <BrowserRouter>
    <Header />

    <main>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<Registerscreen />} />
        <Route path="/dashboard" element={<MyNotes />} />
        <Route path="/mynotes" element={<MyNotes />} />
      </Routes>
    </main>

    <Footer />
  </BrowserRouter>
);

export default App;
