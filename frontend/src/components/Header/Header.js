import React, { useEffect, useState, useCallback } from "react";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);

  const checkUser = useCallback(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      setUserInfo(JSON.parse(stored));
    } else {
      setUserInfo(null);
    }
  }, []);

  // Re-check auth on every route change
  useEffect(() => {
    checkUser();
  }, [location, checkUser]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="border-bottom">
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/">
          NOTEZZ
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Center search - only show when logged in */}
          {userInfo && (
            <Nav className="m-auto">
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                />
              </Form>
            </Nav>
          )}

          {/* Right menu */}
          <Nav className="ms-auto me-3">
            {userInfo ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  My Notes
                </Nav.Link>
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <NavDropdown.Item>My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
