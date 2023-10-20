import { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
  return (
    <Fragment>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </Fragment>
  );
}

export default App;
