import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/user/Header";
import {useSelector } from "react-redux";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"; 
// import {  getUserById, updateUserByAdmin } from "../../../data/authApi";
 import { ToastContainer, toast } from "react-toastify";
import { getUser, getUserById, updateUser, updateUserByAdmin } from "../../../data/authApi";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [validated, setValidated] = useState("");
  const [validatedEmail, setValidatedEmail] = useState("");
  const [validatedPhone, setValidatedPhone] = useState("");
  const [validatedPassword, setValidatedPassword] = useState("");
  const [validatedConPass, setValidatedConPass] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [lastName, setLastName] = useState("");
  const [fistName, setFistName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");

  useEffect(() => {
    if (user) {
      const decode = jwt_decode(user?.data.accessToken);
      setId(decode?.id);
      // setLastName(decode?.lastName);
    }

  }, []);

  useEffect(()=> {
    getAdminById()
  }, [id])

  const getAdminById = async() => {
    console.log("aaaaa")
    let res = await getUser(id, user.data.accessToken)
    if(res && res.status === 200) {
      setFistName(res.data.data.firstName)
      setLastName(res.data.data.lastName)
      setCode(res.data.data.code)
      setEmail(res.data.data.email)
      setLocation(res.data.data.location);
      setSchool(res.data.data.school);
      setPhone(res.data.data.phone);
    }
  }

  const handleFormSubmit = async() => {

    const res = await updateUser(
      id,
      fistName,
      lastName,
      code,
      phone,
      location,
      school,
      user.data.accessToken
    );
    if(res && res.status === 200) {
      toast.success("Update sucess!!")
    } else {
      toast.error("Update failed!!");
    }
  };

  return (
    <Box m="20px">
      <Header title="UPDATE ACCOUNT" subtitle="Update User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          // errors,
          // touched,
          handleBlur,
          // handleSubmit,
        }) => (
          <form>
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
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                onClick={handleFormSubmit}
                color="secondary"
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
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
