import React from "react";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();


  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="border-bottom">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/">
          NOTEZZ
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center search */}
          <Nav className="m-auto">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
              />
            </Form>
          </Nav>

          {/* Right menu */}
          <Nav className="me-3">
            <Nav.Link as={Link} to="/mynotes">
              My Notes
            </Nav.Link>

            <NavDropdown title="Saransh" id="basic-nav-dropdown">
              <NavDropdown.Item>My Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick ={() =>{
                localStorage.removeItem("userInfo");
                navigate("/")
              }}>
                Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
