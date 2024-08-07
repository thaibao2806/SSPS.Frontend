import { useEffect, useState } from "react";
import "../assets/login.css";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/apiRequest";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { forgotPassword, forgotPasswordOTP } from "../data/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validated, setValidated] = useState("");
  const [validatedConfirmPassword, setValidatedConfirmPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Lấy đường dẫn từ URL
    const fullURL = window.location.href;
    const emailLocal = localStorage.getItem("emailOTP")
    setEmail(emailLocal)
    console.log(emailLocal)


    const urlToken = fullURL.replace(
      "http://localhost:5173/forgot-password?",
      ""
    );

    setToken(urlToken);
    displayThemeButtons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmPassword || !password || !otp) {
      setValidated("Need to fill in all information !");
      return;
    } else {
      setValidated("");
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

    if (!passwordPattern.test(password)) {
      setValidatedPassword(
        "Password must contain at least 8 characters, including [A-Z], [a-z], [0-9], [@, #,..]"
      );
      return;
    } else {
      setValidatedPassword("");
    }
    if (confirmPassword !== password) {
      setValidatedConfirmPassword("Re-entered password is incorrect!");
    } else {
      setValidatedConfirmPassword("");
    }

    let res = await forgotPasswordOTP(otp, email, password, confirmPassword);
    if (res && res.data.msgCode === "SUCCESS") {
      navigate("/login");
    }else {
      setValidated(res.data.msgDesc)
    }
  };

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

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <section className="container">
        <div className="login-container">
          <div className="circle circle-one"></div>
          <div className="form-container">
            <img
              src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
              alt="illustration"
              className="illustration"
            />
            <h1 className="opacity">FORGOT PASSWORD</h1>
            <span className="text-danger">
              {validated || validatedPassword || validatedConfirmPassword}
            </span>
            <form>
              <input
                type="text"
                value={otp}
                placeholder="OTP"
                onChange={(e) => setOTP(e.target.value)}
                onKeyDown={handlePressEnter}
              />
              <div className="position-relative w-100">
                <input
                  type={isShowPassword ? "text" : "password"}
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
                  {isShowPassword === true ? (
                    <AiFillEye className="icon-eye" />
                  ) : (
                    <AiFillEyeInvisible className="icon-eye" />
                  )}
                </span>
                {/* <span className="text-danger">{validatedPassword}</span> */}
              </div>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handlePressEnter}
              />
              <button className="opacity" onClick={handleSubmit}>
                CONFIRM
              </button>
            </form>

            <div
              className="d-flex flex-row align-items-center justify-content-center pb-2"
              style={{ fontSize: "15px" }}
            >
              <p className="mb-0">Edit email</p>
              <Link to={"/checkmail"} className="btn btn-danger ms-2">
                Check Email
              </Link>
            </div>
          </div>
          <div className="circle circle-two"></div>
        </div>
        <div className="theme-btn-container"></div>
      </section>
      {/* <Container className="py-5 gradient-form login-form">
        <div className="d-flex justify-content-center align-items-center">
          <div className="mb-5 login-form" style={{ width: "30%" }}>
            <div className="d-flex flex-column  shadow-lg p-3 mb-5 bg-white rounded ">
              <div className="text-center">
                <h4 className="mt-1 mb-2 pb-1 fw-bold">Reset Password</h4>
              </div>

              <Form noValidate>
                <span className="text-danger">{validated}</span>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom01">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        required
                        type={isShowPassword === true ? "text" : "password"}
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handlePressEnter}
                      />
                      <InputGroup.Text
                        id="inputGroupPrepend"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        {isShowPassword === true ? (
                          <AiFillEye className="icon-eye" />
                        ) : (
                          <AiFillEyeInvisible className="icon-eye" />
                        )}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom02">
                    <Form.Label>Repassword</Form.Label>
                    <div>
                      <InputGroup hasValidation>
                        <Form.Control
                          required
                          type={isShowPassword === true ? "text" : "password"}
                          value={confirmPassword}
                          placeholder="RePassword"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onKeyDown={handlePressEnter}
                        />
                        <InputGroup.Text
                          id="inputGroupPrepend"
                          onClick={() => setIsShowPassword(!isShowPassword)}
                        >
                          {isShowPassword === true ? (
                            <AiFillEye className="icon-eye" />
                          ) : (
                            <AiFillEyeInvisible className="icon-eye" />
                          )}
                        </InputGroup.Text>
                      </InputGroup>
                    </div>
                    <span className="text-danger">{validatedPassword}</span>
                  </Form.Group>
                </Row>
                <Button className="mb-3 w-100 " onClick={handleSubmit}>
                  Confirm
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </Container> */}
    </>
  );
};

export default ForgotPassword;
