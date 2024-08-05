export interface UserState {
  email: string;
  password: string;
  isAuthenticated: boolean;
  name: string;
  lastName: string;
  image: string;
}
export interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}
