import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <main className="py-3 flex-grow-1 overflow-auto">
        <Container>
          <Outlet />
        </Container>
      </main>
      <ToastContainer theme="dark" position="bottom-right" autoClose={2000} />
      <Footer />
    </div>
  );
}

export default App;
