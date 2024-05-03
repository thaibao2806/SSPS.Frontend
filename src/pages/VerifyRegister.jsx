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
import { options } from '@fullcalendar/core/preact.js';
import { activeAccount } from '../data/authApi';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const error = useSelector(state => state.auth.register?.msg)
  const [validated, setValidated] = useState("");
  const [email, setEmail] = useState("");
  const [OTP, setOtp] = useState(new Array(6).fill(""))

  useEffect(()=> {
    localStorage.getItem("emailRegister")
    console.log(localStorage.getItem("emailRegister"))
    setEmail(localStorage.getItem("emailRegister"))
  }, [])

  const handleChange = (e, index) => {
    if(isNaN(e.target.value)) {
        return false
    }

    setOtp([...OTP.map((data, indx)=> (indx === index ? e.target.value: data))])

    if(e.target.value && e.target.nextSibling) {
        e.target.nextSibling.focus()
    }

  }

  const handleSubmit = async(event) => {
    const form = event.currentTarget;
    console.log(OTP.join(""))   
    let res = await activeAccount(email, OTP.join(""))
    console.log(res)
    if(res.data.result) {
        toast("Register success!")
        navigate("/login")
    }else {
        setValidated(res.data.msgDesc)
    }
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
          <div className="otp-container">
            {/* <div className="circle circle-one"></div> */}
            <div className="form-container">
              <img
                src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
                alt="illustration"
                className="illustrations"
              />
              <h1 className="opacity">VERIFY ACCOUNT</h1>
              <p>Please check your email and enter the OTP code to complete registration</p>
              <span className="text-danger">{validated}</span>
              <form>
                <div style={{display:"flex", paddingBottom:"20px", paddingTop:"10px"}}>
                {OTP.map((data, i) => {
                    return <input
                    required
                    type="text"
                    style={{margin:"0px 5px 0px 5px"}}
                    maxLength={1}
                    onChange={(e) => handleChange(e, i)}
                    value={data}
                    onKeyDown={handlePressEnter}
                  />
                })}
                </div>
                
              </form>
              <button
                className="opacity btn btn-primary w-100 mt-2"
                onClick={handleSubmit}
                style={{fontSize: "18px"}}
              >
                Verify Account
              </button>
              <div
                className="d-flex justify-content-between align-items-center pt-1 mb-3 pb-1 "
                style={{ fontSize: "13px" }}
              ></div>

              <div
                className="d-flex flex-row align-items-center justify-content-center pb-2 "
                style={{ fontSize: "15px" }}
              >
                <p className="mb-0">Back to register?</p>
                <Link to={"/register"} className="btn btn-danger ms-2 btn-sm">
                  Register
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