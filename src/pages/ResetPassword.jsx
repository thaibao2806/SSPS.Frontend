import { useEffect, useState } from "react";
import "../assets/login.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/apiRequest";
import { resetPassword } from "../data/authApi";
import jwt_decode from "jwt-decode"; 
import "./login.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validatedConfirmPassword, setValidatedConfirmPassword] = useState("");
  const [validated, setValidated] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const user = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    if (user) {
      const decode = jwt_decode(user?.data.accessToken);
      console.log(decode?.firstName);
      setId(decode?.id);
      // setLastName(decode?.lastName);
    }
    displayThemeButtons()
  }, []);


  const handleSubmit = async () => {
    if (!currentPassword || !password || !confirmPassword) {
      setValidated("Need to fill in all information !");
      return;
    } else {
      setValidated("");
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

    if (!passwordPattern.test(password) && !passwordPattern.test(currentPassword) && !passwordPattern.test(confirmPassword)) {
      setValidated(
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters."
      );
      return;
    } else {
      setValidated("");
    }

    if (password !== confirmPassword) {
      setValidatedConfirmPassword("Re-entered password is incorrect!");
      return;
    } else {
      setValidatedConfirmPassword("");
    }

    let res = await resetPassword(
      id,
      currentPassword,
      password,
      confirmPassword,
      user.data.accessToken
    );

    if (res && res.status === 200 && res.data.msgCode === "SUCCESS") {
      setValidated(res.data.msgDesc)
      navigate("/")
    }
    else {
      setValidated(res.data.msgDesc);
    }

    console.log(res);
  };

  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
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
            <h1 className="opacity">RESET PASSWORD</h1>
            <span className="text-danger">{validated}</span>
            <form>
              <input
                type="password"
                placeholder="Enter current password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={handlePressEnter}
              />

              <input
                type="password"
                placeholder="Enter your new password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePressEnter}
              />

              <input
                type="password"
                placeholder="Enter the password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handlePressEnter}
              />
              <span className="text-danger">{validatedConfirmPassword}</span>
              {/* <span className="text-danger">{validatedEmail}</span> */}

              <button className="opacity" onClick={handleSubmit}>
                CONFIRM
              </button>
            </form>

            <div
              className="d-flex flex-row align-items-center justify-content-center pb-2"
              style={{ fontSize: "15px" }}
            >
              <p className="mb-0">Back to Home?</p>
              <Link to={"/"} className="btn btn-danger ms-2">
                Home
              </Link>
            </div>
          </div>
          <div className="circle circle-two"></div>
        </div>
        <div className="theme-btn-container"></div>
      </section>
      {/* <Container className="my-5 gradient-form login-form">
        <div className="d-flex justify-content-center align-items-center">
          <div className="mb-5 login-form ">
            <div className="d-flex flex-column  shadow-lg p-3 mb-5 bg-white rounded">
              <div className="text-center">
                <h4 className="mt-1 mb-2 pb-1">Reset password</h4>
              </div>

              <Form noValidate>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom01">
                    <Form.Label>Current password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      onKeyDown={handlePressEnter}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom01">
                    <Form.Label>New password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handlePressEnter}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom02">
                    <Form.Label>RePassword</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={handlePressEnter}
                    />
                    <span className="text-danger">
                      {validatedConfirmPassword}
                    </span>
                  </Form.Group>
                </Row>
                <Button className="mb-3 w-100 " onClick={handleSubmit}>
                  Confirm
                </Button>
              </Form>

              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Back to login</p>
                <Link to={"/login"} className="btn btn-danger ms-2">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container> */}
    </>
  );
};

export default ResetPassword;
