import React, { useContext, useState } from "react";
import "./Register.css";
import { AuthContext } from "../Auth/AuthContext";
import LockIcon from "@mui/icons-material/Lock";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import { enqueueSnackbar } from "notistack";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useContext(AuthContext);

  const onHandleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const { firstName, lastName, email, password, phone, role, answer } =
      formData;

    if (firstName.length < 2 || firstName.length > 30) {
      enqueueSnackbar("First name must be between 2 and 30 characters", {
        variant: "error",
      });
      return;
    }

    if (lastName.length < 2 || lastName.length > 30) {
      enqueueSnackbar("Last name must be between 2 and 30 characters", {
        variant: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar("Enter a valid email", { variant: "error" });
      return;
    }

    if (password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters long", {
        variant: "error",
      });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      enqueueSnackbar("Phone number must be 10 digits", { variant: "error" });
      return;
    }

    if (!role) {
      enqueueSnackbar("Please select a role", { variant: "error" });
      return;
    }

    if (answer.length < 2) {
      enqueueSnackbar("Security answer is too short", { variant: "error" });
      return;
    }
    
    setIsLoading(true);
    try {
      await register(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="wrapper">
        <form onSubmit={submitHandler}>
          <div className="box-container relative bg-black flex items-center justify-center overflow-hidden">
            <div className="absolute bg-black rounded-[50px_5px] inset-1 p-[50px_40px] z-10 text-white">
              <h1>Register</h1>
              <div className="form-group">
                <PersonIcon className="mt-3 text-white" />
                <input
                  className="border-0 outline-none relative flex items-center justify-start"
                  onChange={onHandleChange}
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-group">
                <PersonIcon className="mt-3 text-white" />
                <input
                  className="border-0 outline-none relative flex items-center justify-start"
                  onChange={onHandleChange}
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="form-group">
                <MailOutlineIcon className="mt-3 text-white" />
                <input
                  className="border-0 outline-none relative flex items-center justify-start"
                  onChange={onHandleChange}
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <LockIcon className="mt-3 text-white" />
                <input
                  className="border-0 outline-none relative flex items-center justify-start"
                  onChange={onHandleChange}
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="form-group">
                <PhoneIcon className="mt-3 text-white" />
                <input
                  className="border-0 outline-none relative flex items-center justify-start"
                  onChange={onHandleChange}
                  name="phone"
                  type="number"
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="form-group">
                <BadgeIcon className="mt-3 text-white" />
                <select
                  className="border-0 outline-none relative flex items-center justify-start"
                  name="role"
                  onChange={onHandleChange}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Content Creator</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="form-group">
                <AccountBalanceIcon className="mt-3 text-white" />
                <input
                  className="border-0 outline-none relative flex items-center justify-start"
                  onChange={onHandleChange}
                  name="answer"
                  type="text"
                  placeholder="Your first School"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button type="submit" className="register absolute" disabled={isLoading}>
                  {isLoading ? "REGISTERING..." : "REGISTER"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
