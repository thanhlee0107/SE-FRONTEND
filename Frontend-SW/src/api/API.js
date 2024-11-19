import axios from "./axiosConfig";
const createUserApi = (name, email, password) => {
  const URL_API = "/auth/register";
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};
const loginApi = (email, password) => {
  const URL_API = "/auth/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};
export { createUserApi, loginApi };