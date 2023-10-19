import { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Header } from "./components/Header";

function App() {
  return (
    <Fragment>
      <Header />
      <main className="py-3">
        <Container>
          <h1>Shop</h1>
        </Container>
      </main>
    </Fragment>
  );
}

export default App;
