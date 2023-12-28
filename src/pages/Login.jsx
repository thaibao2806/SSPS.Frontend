import { useEffect, useState } from 'react'
import "../assets/login.css"
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { Button, Col, Container, Form,  InputGroup,  Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../redux/apiRequest';
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import "./login.css"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validated, setValidated] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const error = useSelector((state) => state.auth.login?.msg);

  useEffect(() => {
    // Kiểm tra xem có mật khẩu đã lưu trong Local Storage không
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedPassword && savedEmail) {
      setEmail(savedEmail)
      setPassword(savedPassword);
      setRememberPassword(true);
    }
  displayThemeButtons();

  }, []);

  const handleRememberPasswordChange = () => {
    setRememberPassword(!rememberPassword);
  };

  const handleSubmit = async() => {
    const user = {
      email: email,
      password,
    };

    if (rememberPassword) {
      // Lưu mật khẩu vào Local Storage nếu checkbox "Nhớ mật khẩu" được chọn
      localStorage.setItem("rememberedPassword", password);
      localStorage.setItem("rememberedEmail", email);
    } else {
      // Xóa mật khẩu từ Local Storage nếu checkbox không được chọn
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberedEmail");
    }

    if(!email || !password) {
      setValidated("Need to fill in all information !");
      return
    } else {
      setValidated("")
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

    if (!passwordPattern.test(password)) {
      setValidatedPassword(
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters."
      );
      return;
    } else {
      setValidatedPassword("");
    }

    const isEmailValid = email.includes("@");
    if(!isEmailValid) {
      setValidatedEmail("Email invalidate!");
      return
    } else {
      setValidatedEmail("")
    }

    let res = await loginUser(user, dispatch, navigate)
    await setValidated(res || error || "");
    console.log(res)
  };

  const handlePressEnter = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  const themes = [
    {
      background: "#1A1A2E",
      color: "#000000",
      primaryColor: "#0F3460",
    },
    {
      background: "#461220",
      color: "#000000",
      primaryColor: "#E94560",
    },
    {
      background: "#192A51",
      color: "#000000",
      primaryColor: "#967AA1",
    },
    {
      background: "#F7B267",
      color: "#000000",
      primaryColor: "#F4845F",
    },
    {
      background: "#F25F5C",
      color: "#000000",
      primaryColor: "#642B36",
    },
    {
      background: "#231F20",
      color: "#000000",
      primaryColor: "#BB4430",
    },
  ];

  const setTheme = (theme) => {
    const root = document.querySelector(":root");
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--color", theme.color);
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--glass-color", theme.glassColor);
  };

  const displayThemeButtons = () => {
    const btnContainer = document.querySelector(".theme-btn-container");
    themes.forEach((theme) => {
      const div = document.createElement("div");
      div.className = "theme-btn";
      div.style.cssText = `background: ${theme.primaryColor}; width: 25px; height: 25px`;
      btnContainer?.appendChild(div);
      div.addEventListener("click", () => setTheme(theme));
    });
  };



  return (
    <div className="body-login ">
      <section className="container">
        <div className="login-container">
          {/* <div className="circle circle-one"></div> */}
          <div className="form-container">
            <img
              src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
              alt="illustration"
              className="illustration"
            />
            <h1 className="opacity">LOGIN</h1>
            <span className="text-danger">{validated}</span>
            <form>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handlePressEnter}
              />
              <span className="text-danger">{validatedEmail}</span>
              <div className="position-relative">
                <input
                  type={isShowPassword === true ? "text" : "password"}
                  value={password}
                  placeholder="Password"
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
              <span className="text-danger">{validatedPassword}</span>
            </form>
            <button
              className="opacity btn btn-primary w-100"
              onClick={handleSubmit}
            >
              LOGIN
            </button>
            <div
              className="d-flex justify-content-between align-items-center pt-1 mb-3 pb-1 "
              style={{ fontSize: "13px" }}
            >
              <div>
                <input
                  type="checkbox"
                  name="remember"
                  id="rememberpass"
                  className="form-check-input me-1"
                  checked={rememberPassword}
                  onChange={handleRememberPasswordChange}
                />
                <label htmlFor="rememberpass" className="form-check-label">
                  Remember password
                </label>
              </div>
              <Link className="text-muted" to={"/checkmail"}>
                Forgot password?
              </Link>
            </div>

            <div
              className="d-flex flex-row align-items-center justify-content-center pb-2"
              style={{ fontSize: "15px" }}
            >
              <p className="mb-0">Don't have an account?</p>
              <Link to={"/register"} className="btn btn-danger ms-2">
                Register
              </Link>
            </div>
          </div>
          {/* <div className="circle circle-two"></div> */}
        </div>
        {/* <div className="theme-btn-container"></div> */}
      </section>
    </div>
  );
}

export default Login