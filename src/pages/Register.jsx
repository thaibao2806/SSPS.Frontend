import { useEffect, useState } from 'react'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../redux/apiRequest';
import CitySelect from "../components/CitySelect";
import DistrictSelect from "../components/DistrictSelect";
import WardSelect from "../components/WardSelect";
import axios from 'axios';
import "./register.css"
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error = useSelector(state => state.auth.register?.msg)
  const [validated, setValidated] = useState("");
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validatedPhone, setValidatedPhone] = useState("")
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validatedConPass, setValidatedConPass] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastName, setLastName] = useState("")
  const [fistName, setFistName] = useState("")
  const [code, setCode] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [school, setSchool] = useState("");
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState("");
   const [selectedWard, setSelectedWard] = useState("");
  const [address, setAddress] = useState("")
  const [isShowPassword, setIsShowPassword] = useState(false);


 useEffect(() => {
   // Lấy danh sách các tỉnh thành phố
   axios.get("https://vapi.vnappmob.com/api/province").then((response) => {
     setProvinces(response.data.results);
   });
 }, []);

 // Lấy danh sách các quận huyện khi tỉnh thành phố được chọn
 useEffect(() => {
   if (selectedProvince !== "") {
     axios
       .get(`https://vapi.vnappmob.com/api/province/district/${selectedProvince}`)
       .then((response) => {
         setDistricts(response.data.results);
         console.log(response.data.results)
       });
   }
 }, [selectedProvince]);

 // Lấy danh sách các phường xã khi quận huyện được chọn
 useEffect(() => {
   if (selectedDistrict !== "") {
     axios
       .get(`https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`)
       .then((response) => {
         setWards(response.data.results);
       });
   }
 }, [selectedDistrict]);

 const handleProvinceChange = (e) => {
   setSelectedProvince(e.target.value);
   console.log(e)
   setDistricts([]);
   setWards([]);
 };

 const handleDistrictChange = (e) => {
   setSelectedDistrict(e.target.value);
   setWards([]);
 };

 const handleWardChange = (e) => {
   setSelectedWard(e.target.value);
 };

 const printResult = () => {
   if (
     selectedProvince !== "" &&
     selectedDistrict !== "" &&
     selectedWard !== ""
   ) {
     const result = ` ${
       wards.find(
         (ward) =>
           String(ward.ward_id) === String(selectedWard) && ward !== undefined
       )?.ward_name
     }, ${
       districts.find(
         (district) => String(district.district_id) === String(selectedDistrict)
       )?.district_name
     }, ${
       provinces.find(
         (province) => String(province.province_id) === String(selectedProvince)
       )?.province_name
     }`;
     return result;
   }
   return "";
 };
  const handleSubmit = async(event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    localStorage.setItem("emailRegister", email)

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !lastName ||
      !fistName ||
      !code ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !location
    ) {
      setValidated("Need to fill in all information");
      return;
    } else {
      setValidated("");
    }

    const phonePattern = /^0\d{9}$/;
    if(!phonePattern.test(phone)) {
      setValidatedPhone("The phone number is not in the correct format");
      return
    } else {
      setValidatedPhone("")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\..+$/;
    if (!emailRegex.test(email)) {
      setValidatedEmail("Email invalidate!");
      return;
    } else {
      setValidatedEmail("");
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
    
    if(!passwordPattern.test(password)) {
      setValidatedPassword(
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters."
      );
      return
    } else {
      setValidatedPassword("")
    }

    if(confirmPassword !== password) {
      setValidatedConPass("Re-entered password is incorrect");
      return
    } else {
      setValidatedConPass("")
    }

    const user = {
      code: code,
      firstName: fistName,
      lastName: lastName,
      email: email,
      password: password,
      role: "user",
      phone: phone,
      school: school,
      location: `${location},${printResult()}`,
    };

    const res = await registerUser(user, dispatch, navigate)
    setValidated(res|| error)
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="body-login ">
        <section className="container">
          <div className="register-container">
            {/* <div className="circle circle-one"></div> */}
            <div className="form-container">
              <img
                src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
                alt="illustration"
                className="illustrations"
              />
              <h1 className="opacity">REGISTER</h1>
              <span className="text-danger">{validated}</span>
              <form>
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    required
                    type="text"
                    placeholder="First name"
                    className="me-2"
                    onChange={(e) => setFistName(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    required
                    type="text"
                    placeholder="Code"
                    className="me-2"
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Phone number"
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                </div>
                <span className="text-danger">{validatedPhone}</span>

                <div className="d-flex justify-content-center align-items-center">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="me-2"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                  <input
                    required
                    type="text"
                    placeholder="School"
                    onChange={(e) => setSchool(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                </div>
                <span className="text-danger">{validatedEmail}</span>

                <div className="d-flex justify-content-center align-items-center">
                  <select
                    aria-label="Default select example"
                    id="province"
                    placeholder="Province"
                    className="me-2"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                  >
                    <option value="" disabled>
                      Province
                    </option>
                    {provinces?.map((province) => (
                      <option key={province.province_id} value={province.province_id}>
                        {province.province_name}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Default select example"
                    id="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                  >
                    <option value="" disabled>
                      District
                    </option>
                    {districts.map((district) => (
                      <option key={district.district_id} value={district.district_id}>
                        {district.district_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <select
                    aria-label="Default select example"
                    id="ward"
                    className="me-2"
                    value={selectedWard}
                    onChange={handleWardChange}
                  >
                    <option value="" disabled>
                      Ward
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.ward_id} value={ward.ward_id}>
                        {ward.ward_name}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    type="text"
                    placeholder="Apartment number"
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handlePressEnter}
                  />
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  <div className="position-relative w-100">
                    <input
                      required
                      type={isShowPassword === true ? "text" : "password"}
                      value={password}
                      placeholder="Password"
                      className="me-2"
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handlePressEnter}
                    />
                    <span
                      className="position-absolute end-0 top-50 translate-middle-y pe-1"
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      // onClick={handleTogglePassword}
                      onClick={() => setIsShowPassword(!isShowPassword)}
                    >
                      {isShowPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </span>
                  </div>
                  <div className='w-100 ms-2'>
                    <input
                      required
                      type="password"
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={handlePressEnter}
                    />
                  </div>
                </div>
                <span className="text-danger">
                  {validatedConPass || validatedPassword}
                </span>
                <span className="text-danger">{}</span>
              </form>
              <button
                className="opacity btn btn-primary w-100 mt-2"
                onClick={handleSubmit}
              >
                REGISTER
              </button>
              <div
                className="d-flex justify-content-between align-items-center pt-1 mb-3 pb-1 "
                style={{ fontSize: "13px" }}
              ></div>

              <div
                className="d-flex flex-row align-items-center justify-content-center pb-2 "
                style={{ fontSize: "15px" }}
              >
                <p className="mb-0">Do you have an account?</p>
                <Link to={"/login"} className="btn btn-danger ms-2">
                  Login
                </Link>
              </div>
            </div>
            {/* <div className="circle circle-two"></div> */}
          </div>
          {/* <div className="theme-btn-container"></div> */}
        </section>
      </div>
    </>
  );
}

export default Register