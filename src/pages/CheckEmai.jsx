import { useEffect, useState } from "react";
import "../assets/login.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/apiRequest";
import { checkEmail } from "../data/authApi";
import Spinner from "react-bootstrap/Spinner";
import "./login.css";

const CheckEmail = () => {
  const navigate = useNavigate();
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validated, setValidated] = useState("");
  const [email, setEmail] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Kiểm tra xem có mật khẩu đã lưu trong Local Storage không
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedPassword && savedEmail) {
      setEmail(savedEmail);
      setRememberPassword(true);
    }
    displayThemeButtons()
  }, []);

  const handleRememberPasswordChange = () => {
    setRememberPassword(!rememberPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rememberPassword) {
      // Lưu mật khẩu vào Local Storage nếu checkbox "Nhớ mật khẩu" được chọn
      localStorage.setItem("rememberedEmail", email);
    } else {
      // Xóa mật khẩu từ Local Storage nếu checkbox không được chọn
      localStorage.removeItem("rememberedEmail");
    }

    setIsLoading(true);

    if (!email ) {
      setIsLoading(false);
      setValidatedEmail("Need to fill in all information!");
      return;
    } else {
      setValidatedEmail("");
    }
    const isEmailValid = email.includes("@");
    if (!isEmailValid) {
      setIsLoading(false);
      setValidatedEmail("Email invalidate!");
      return;
    } else {
      setValidatedEmail("");
    }

    let res = await checkEmail(email);

    if (res && res.status === 200 && res.data.msgCode === "SUCCESS") {
      setIsLoading(false)
      setValidated("Email sent!");
    } else {
      setValidated("")
      setIsLoading(false);
      setValidatedEmail(res.data.msgDesc);
    }
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
            <h1 className="opacity">Email</h1>
            <span className="text-success text-center">{validated}</span>
            <form>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handlePressEnter}
              />
              <span className="text-danger">{validatedEmail}</span>

              <button className="opacity" onClick={handleSubmit}>
                {isLoading ? (
                  <>
                    <Spinner
                      animation="border"
                      role="status"
                      size="sm"
                      className="me-1"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                ) : (
                  ""
                )}
                CONTINUE
              </button>
            </form>
            <p>
              The email will be sent to your inbox, check spam if you don't see
              it
            </p>
            <div
              className="d-flex flex-row align-items-center justify-content-center pb-2"
              style={{ fontSize: "15px" }}
            >
              <p className="mb-0">Back to login</p>
              <Link to={"/login"} className="btn btn-danger ms-2">
                Login
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
                <h4 className="mt-1 mb-2 pb-1">Confirm Email</h4>
                <p>
                  The email will be sent to your inbox, check spam if you don't
                  see it
                </p>
              </div>
              <span className="text-success text-center">{validated}</span>
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
                <Button className="mb-3 w-100 " onClick={handleSubmit}>
                  {isLoading ? (
                    <>
                      <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </>
                  ) : (
                    ""
                  )}
                  Continue
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

export default CheckEmail;
