import axios from "axios";
import jwt_decode from "jwt-decode"
import { refresh, url } from "./config";



export const refreshToken = async(user) => {
    try {
      console.log("đang ở đây")
      const res = await axios.get(url + refresh + user?.data.refreshToken ,{}, {
        headers: {
          Authorization: `Bearer ${user?.data.token}`,
        },
      })
      console.log("dang fresh",res.data)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date()
      const decodedToken = jwt_decode(user?.data.accessToken)
      
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken(user);
        const refreshUser = {
          ...user,
          data: {
            ...user.data,
            accessToken: data.data.accessToken, // Cập nhật lại access token mới
          },
        };

        dispatch(stateSuccess(refreshUser));
        config.headers["Authorization"] = "Bearer " + data.data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return newInstance;
}
