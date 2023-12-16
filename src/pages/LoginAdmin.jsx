import { useEffect, useState } from "react";
import "../assets/login.css";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, loginUser } from "../redux/apiRequest";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import "./login.css";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validated, setValidated] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const error = useSelector((state) => state.auth.login?.msg);

  useEffect(() => {
   displayThemeButtons()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = {
      email: email,
      password,
    };


    if (!email || !password) {
      setValidated("Need to fill in all information !");
      return;
    } else {
      setValidated("");
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
    if (!isEmailValid) {
      setValidatedEmail("Email invalidate!");
      return;
    } else {
      setValidatedEmail("");
    }

    let res = await loginAdmin(user, dispatch, navigate);
    await setValidated(res || error || "");
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

              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePressEnter}
              />
              <span className="text-danger">{validatedPassword}</span>
              <button className="opacity" onClick={handleSubmit}>
                LOGIN
              </button>
            </form>
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
                <h4 className="mt-1 mb-2 pb-1 fw-bold">LOG IN</h4>
              </div>

              <Form noValidate>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom01">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handlePressEnter}
                    />
                    <span className="text-danger">{validatedEmail}</span>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="" controlId="validationCustom02">
                    <Form.Label>Password</Form.Label>
                    <div>
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
                    </div>
                    
                  </Form.Group>
                </Row>
                <Button className="mb-3 w-100 " onClick={handleSubmit}>
                  Log in
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </Container> */}
    </>
  );
};

export default LoginAdmin;
