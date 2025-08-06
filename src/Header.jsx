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
        <Link to="/" style={{ textDecoration: 'none', marginRight: '30px' , display:'flex',gap:'10px'}}>
        <img style={{ height:'40px',width:'50px',borderRadius:'10px'}} src="data:image/png;base64,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" alt="" />
          <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Stay Hub</h1>
        </Link>
        <Link to="/home" className="home">
          <button className="button w-15">Home</button>
        </Link>
        <Link to="/about" className="about">
          <button className="button w-20">About Us</button>
        </Link>
        <Link to="/blog" className="blog">
          <button className="button w-13">Blog</button>
        </Link>
        <Link to="/contact" className="contact">
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
