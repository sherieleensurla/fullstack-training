import React from "react";
import { Navbar, Container } from "react-bootstrap";

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Rick and Morty Characters</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;