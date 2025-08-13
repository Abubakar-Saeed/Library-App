import { useAuth, UserButton } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import { useCheckRole } from "../Utils/useCheckRole";

export const Navbar = () => {
  const { isSignedIn } = useAuth();
  const isAdmin = useCheckRole("admin"); // replace "admin" with your Roles type value

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Love 2 Read</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                Search Books
              </Link>
            </li>
            {isSignedIn && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/shelf">
                    Shelf
                  </NavLink>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      Admin
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isSignedIn ? (
              <li className="nav-item m-1">
                <UserButton />
              </li>
            ) : (
              <li className="nav-item m-1">
                <Link className="btn btn-outline-light" to="/login">
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
