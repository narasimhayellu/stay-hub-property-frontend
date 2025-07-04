import { useContext, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";
import { AuthContext } from "../Auth/AuthContext";
import { enqueueSnackbar } from "notistack";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const onHandleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const { email, password} = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar("Enter a valid email", { variant: "error" });
      return;
    }
  
    if (password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters long", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="box">
        <form onSubmit={submitHandler}>
        <div className="card-wrapper flex items-center justify-center">
        <div className="card ">
          <h1>Login </h1>
            <div className="card-box">
              <MailOutlineIcon className="mt-3 text-white" />
              <input
                className="border-0 outline-none"
                onChange={onHandleChange}
                name="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="card-box">
              <LockIcon className="mt-3 text-white" />
              <input
                className="border-0 outline-none"
                onChange={onHandleChange}
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="login" disabled={isLoading}>
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </div>
            <div className="font flex justify-between mt-5 mb-5">
              <h5>
                <Link to="/forgot-password">Forgot Password ? </Link>
              </h5>
              <h5>
                <Link to="/register">Register</Link>
              </h5>
            </div>
        </div>
        </div>
        </form>
      </div>
    </>
  );
};

export default Login;
