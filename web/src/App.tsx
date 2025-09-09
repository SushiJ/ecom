import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <div className="container mx-auto px-6 h-full">
      <Header />
      <main className="py-3 flex-grow overflow-y-auto h-[90%] overflow-x-hidden">
        <Outlet />
      </main>
      <ToastContainer theme="dark" position="bottom-right" autoClose={1000} />
      <Footer />
    </div>
  );
}

export default App;
