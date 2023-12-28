import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/admin/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser, registerUser } from "../../redux/apiRequest";
import { useState } from "react";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const error = useSelector((state) => state.auth.register?.msg);
  const [validated, setValidated] = useState("");
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validatedPhone, setValidatedPhone] = useState("");
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validatedConPass, setValidatedConPass] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [fistName, setFistName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");

  const handleFormSubmit = async(values) => {
    values.preventDefault()
    if(!code || !fistName || !email || !password || !phone || !location || !school) {
      setValidated("Need to fill in all information!");
      return
    } else {
      setValidated("")
    }

    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(phone)) {
      setValidatedPhone("The phone number is not in the correct format");
      return;
    } else {
      setValidatedPhone("");
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

    if (!passwordPattern.test(password)) {
      setValidatedPassword(
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters."
      );
      return;
    } else {
      setValidatedPassword("");
    }

    if (confirmPassword !== password) {
      setValidatedConPass("Re-entered password is incorrect");
      return;
    } else {
      setValidatedConPass("");
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
      location: location,
    };

    const res = await createUser(user, dispatch);
    setValidated(res || error);
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />
      <p className="text-danger">{validated || validatedConPass || validatedEmail || validatedPassword || validatedPhone}</p>
      <Formik
        onSubmit={handleFormSubmit}
        // initialValues={initialValues}
        // validationSchema={checkoutSchema}
      >
        {({
          // errors,
          // touched,
          handleBlur,
          // handleSubmit,
        }) => (
          <form >
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={(e) => setFistName(e.target.value)}
                value={fistName}
                name="firstName"
                // error={!!touched.firstName && !!errors.firstName}
                // helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                name="lastName"
                // error={!!touched.lastName && !!errors.lastName}
                // helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="MSSV"
                onBlur={handleBlur}
                onChange={(e) => setCode(e.target.value)}
                value={code}
                name="firstName"
                // error={!!touched.firstName && !!errors.firstName}
                // helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                name="lastName"
                // error={!!touched.lastName && !!errors.lastName}
                // helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                // error={!!touched.email && !!errors.email}
                // helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                name="contact"
                // error={!!touched.contact && !!errors.contact}
                // helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="School"
                onBlur={handleBlur}
                onChange={(e) => setSchool(e.target.value)}
                value={school}
                name="address1"
                // error={!!touched.address1 && !!errors.address1}
                // helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name="address2"
                // error={!!touched.address2 && !!errors.address2}
                // helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button onClick={handleFormSubmit} color="secondary" variant="contained">
                Add
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default Form;
