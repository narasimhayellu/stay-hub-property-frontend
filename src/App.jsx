import Header from "./Header";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ForgotPass from "./ForgotPass/ForgotPass";
import ResetPassword from "./reset-password";
import Property from "./Property/Property";
import AddNewProperty from "./Add-new-property/add-new-property";
import PropertyDetails from "./PropertyDetails/PropertyDetails";
import EditProperty from "./EditProperty/EditProperty";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password/" element={<ResetPassword />} />
          <Route path="/property-listing" element={<Property/>}/>
          <Route path="/add-new-property" element={<AddNewProperty/>}/>
          <Route path="/property/:id" element={<PropertyDetails/>}/>
          <Route path="/property/:id/edit" element={<EditProperty/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
