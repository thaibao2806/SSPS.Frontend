import axios from "axios";
import jwt_decode from "jwt-decode"



export const refreshToken = async(user) => {
    try {
      const res = await axios.post("https://auth-server-fmp.vercel.app/auth/refresh-token",{}, {
        headers: {
          Authorization: `Bearer ${user?.data.token}`,
        },
        withCredentials: true
      })
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
      const decodedToken = jwt_decode(user?.data.token)
      
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken(user);
        const refreshUser = {
          ...user.data,
          data: {
            token: data.data.token,
          },
        };
        dispatch(stateSuccess(refreshUser));
        config.headers["Authorization"] = "Bearer " + data.data.token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return newInstance;
}
