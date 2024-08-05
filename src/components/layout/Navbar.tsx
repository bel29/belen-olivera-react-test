import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import logo from "../../logo.png";

import { RootState } from "../../store";
import { logout, decryptData } from "../../store/userSlice";

import style from "../../styles/Navbar.module.scss";

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className={`${style.navbarCustom} px-4 pt-2`}>
      <Navbar.Brand as={Link} to="#">
        <img src={logo} alt="logo" style={{ width: 50, height: 50 }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className={`${style.navLink} mr-auto`}>
          <Nav.Link as={Link} to="/products" className={style.productsLink}>
            Products
          </Nav.Link>
        </Nav>
        <Nav>
          <Dropdown align="end" className="d-flex">
            <Dropdown.Toggle variant="light" id="dropdown-basic" className={`d-flex ${style.accDrop}`}>
              {user.image ? (
                <img
                  src={decryptData(user.image)}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: 35, height: 35 }}
                />
              ) : (
                <BsPersonCircle size={24} />
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/users">
                Editar perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
