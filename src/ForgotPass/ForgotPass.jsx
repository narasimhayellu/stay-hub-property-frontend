import { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./ForgotPass.css";
import { enqueueSnackbar } from "notistack";

const ForgotPass = () => {
  const [formData, setFormData] = useState({
    email: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword } = useContext(AuthContext);

  const onHandleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const { email, answer } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar("Enter a valid email", { variant: "error" });
      return;
    }

    if (answer.length < 2) {
      enqueueSnackbar("Security answer is too short", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={submitHandler}>
        <div className="reset-wrapper flex items-center justify-center">
          <div className="block bg-black rounded-[50px_5px] px-6 py-8 relative z-10 w-full h-full flex flex-col justify-center">
            <h3 className="pass">FORGOT PASSWORD</h3>
            <div className="px-4">
              <div className="relative flex items-center justify-start mb-8">
                <MailOutlineIcon className="mr-3 text-white" />
                <input
                  type="email"
                  className="w-full h-10 bg-transparent border-b-2 border-white text-white placeholder:text-[#3CBDB1] placeholder:text-sm placeholder:tracking-wider pl-2 text-base outline-none"
                  placeholder="Email"
                  name="email"
                  onChange={onHandleChange}
                  required
                />
              </div>
              <div className="relative flex items-center justify-start mb-10">
                <AccountBalanceIcon className="mr-3 text-white" />
                <input
                  type="text"
                  className="w-full h-10 bg-transparent border-b-2 border-white text-white placeholder:text-[#3CBDB1] placeholder:text-sm placeholder:tracking-wider pl-2 text-base outline-none"
                  placeholder="Your first School"
                  name="answer"
                  onChange={onHandleChange}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button type="submit" className="reset" disabled={isLoading}>
                  {isLoading ? "SENDING..." : "SEND RESET LINK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPass;
