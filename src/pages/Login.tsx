import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RootState } from "../store";
import { IFormInput, UserState } from "../types/users/User";
import { login, decryptData } from "../store/userSlice";

import logo from "../logo.png";
import styles from "../styles/login.module.scss";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 12 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: IFormInput) => {
    if (!user.email) {
      const defaultUserInfo: UserState = {
        email: data.email,
        password: data.password,
        name: "Default Name",
        lastName: "Default Last Name",
        image:
          "https://banner2.cleanpng.com/20180402/ojw/kisspng-united-states-avatar-organization-information-user-avatar-5ac20804a62b58.8673620215226654766806.jpg",

        isAuthenticated: true,
      };

      dispatch(login(defaultUserInfo));
    } else {
      const userInfo = {
        name: decryptData(user.name),
        password: data.password,
        lastName: decryptData(user.lastName),
        email: data.email,
        image: decryptData(user.image),
        isAuthenticated: true,
      };
      dispatch(login(userInfo));
    }
    navigate("/products");
  };

  return (
    <div className={styles.loginContainer}>
      <img src={logo} className={styles.loginImg}></img>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Password:</label>
          <input type="password" {...register("password")} />
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Confirm Password:</label>
          <input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className={styles.errorMessage}>{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
