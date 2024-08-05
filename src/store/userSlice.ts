import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";
import { UserState } from "../types/users/User";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "default_key";
const VALID_USERNAME = process.env.REACT_APP_USERNAME || "";
const VALID_PASSWORD = process.env.REACT_APP_PASSWORD || "";

const encryptData = (data: string) => {
  const encryptedData = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();

  return encryptedData;
};

export const decryptData = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedText;
  } catch (e) {
    console.error("Error decrypting data:", e);
    return "";
  }
};

const initialState: UserState = {
  email: "",
  password: "",
  isAuthenticated: false,
  name: "Guest",
  lastName: "",
  image:
    "https://banner2.cleanpng.com/20180402/ojw/kisspng-united-states-avatar-organization-information-user-avatar-5ac20804a62b58.8673620215226654766806.jpg",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        email: string;
        password: string;
        name: string;
        lastName: string;
        image: string;
      }>
    ) => {
      const { email, password, name, lastName, image } = action.payload;

      if (email === VALID_USERNAME && password === VALID_PASSWORD) {
        state.email = encryptData(email);
        state.isAuthenticated = true;
        state.name = encryptData(name);
        state.lastName = encryptData(lastName);
        state.image = encryptData(image);
      } else {
        state.isAuthenticated = false;
        console.error("Invalid credentials");
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      // SI SE QUIERE ELIMINAR LA SESION AL HACER LOGOUT DESCOMENTAR yo para simular persistencia de los datos
      //state.email = encryptData("");
      //state.name = encryptData("Guest");
      //state.lastName = encryptData("");
      //state.image = encryptData(initialState.image);
    },
    editUser: (
      state,
      action: PayloadAction<{ name: string; lastName: string; email: string; image: string }>
    ) => {
      const { name, lastName, email, image } = action.payload;

      state.name = encryptData(name);
      state.lastName = encryptData(lastName);
      state.email = encryptData(email);
      state.image = encryptData(image);
    },
  },
});

export const { login, logout, editUser } = userSlice.actions;
export default userSlice.reducer;
