import { Outlet } from "react-router-dom";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  return (
    <div className="container mx-auto px-6">
      <Header />
      <main className="py-3 flex-grow overflow-auto">
        <Outlet />
      </main>
      <ToastContainer theme="dark" position="bottom-right" autoClose={2000} />
      <Footer />
    </div>
  );
}

export default App;
