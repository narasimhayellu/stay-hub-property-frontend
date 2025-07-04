import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthContext";
import { enqueueSnackbar } from "notistack";

const Header = () => {
  const { isLogin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLogin) {
      enqueueSnackbar("Please log in before adding a property.", {
        variant: "warning",
      });
      navigate("/login");
    } else {
      navigate("/add-property");
    }
  };
  return (
    <div className="container" style={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <header className="top" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        flexWrap: 'wrap',
        padding: '10px 20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Link to="/" style={{ marginRight: '20px' }}>
          <img
            className="logo ms-6 mt-2"
            src="https://www.toletglobe.in/assets/logo-ClaEJkU2.png"
            alt=""
            style={{ height: '40px' }}
          />
        </Link>
        <Link to="/home" className="home">
          <button className="button w-15">Home</button>
        </Link>
        <Link to="/home" className="about">
          <button className="button w-20">About Us</button>
        </Link>
        <Link to="/home" className="blog">
          <button className="button w-13">Blog</button>
        </Link>
        <Link to="/home" className="contact">
          <button className="button w-18">Contact</button>
        </Link>
        <Link to="/property-listing" className="prop">
          <button className="button w-33">Property Listing</button>
        </Link>
        <Link to="/add-new-property" className="add">
          <button onClick={handleClick} className="button w-39">+Add New Property</button>
        </Link>
        {!isLogin && (
          <Link to="/login" className="log">
            <button className="button w-30">Login / Signup</button>
          </Link>
        )}
        {isLogin && (
          <button onClick={logout} className="logout button w-30" style={{ marginLeft: 'auto' }}>
            Logout
          </button>
        )}
      </header>
    </div>
  );
};

export default Header;
