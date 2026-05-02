import { Navbar } from "../components/Navbar";
import userhome from "../assets/img/user_white.svg";
import logo from "../assets/img/Troco.svg";
import "../assets/css/Popup.css";
import "../assets/css/Navbar.css";
import "../assets/css/Header.css";
import { AuthContext } from "../contexts/auth-context.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { LogoutContext } from "../contexts/auth-context.jsx";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../api/get-user-info";

export function Header() {
  const { currentUser } = useContext(AuthContext);
  const id = currentUser?.id;
  const logout = useContext(LogoutContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (id) {
      getUserInfo(id)
        .then((data) => setUserInfo(data))
        .catch((error) => console.error(error));
    }

    const handleDocumentClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [id]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = (path) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  return (
    <>
      <nav className="navPrincipal">
        <a href="/">
          <div
            className="logo-header"
            style={{ backgroundImage: `url(${logo})` }}
          ></div>
        </a>
        <Navbar />
        <div className="userMenu">
          <button className="popupHome" onClick={toggleMenu} ref={buttonRef}>
            <i className="material-symbols-rounded">menu</i>
            <img
              className="userhome"
              src={userInfo?.profile_img || userhome}
              alt="User Icon"
            />{" "}
          </button>
          {menuOpen && (
            <div className="menuDropdown" ref={dropdownRef}>
              {currentUser ? (
                <>
                  <div onClick={() => handleMenuClick("/UserInfo")}>
                    Profile
                  </div>
                  <div onClick={() => handleMenuClick(`/storeDetail/${id}`)}>
                    Store
                  </div>
                  <div onClick={() => handleMenuClick("/UserDeals")}>Deals</div>
                  <div onClick={() => handleMenuClick("/WishListPage")}>
                    Wishlist
                  </div>
                  <div onClick={handleLogout}>Logout</div>
                </>
              ) : (
                <>
                  <div onClick={() => handleMenuClick("/login")}>Login</div>
                  <div onClick={() => handleMenuClick("/register")}>
                    Register
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
