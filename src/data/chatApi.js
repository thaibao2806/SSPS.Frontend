import axios from "axios";
import { chat, chatbot, url, urlChatBox } from "../config";

// export const chatBox = async (message) => {
//     try {
//       const formData = new FormData();
//       formData.append('message', message);
//       formData.append('username', 'Phan Thai Bao');
  
//       const response = await axios.post('http://localhost:5000/chatbox', formData);
  
//       return response.data;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error; // Ném lỗi ra bên ngoài để xử lý ở phần gọi hàm
//     }
//   };

export const chatBox = async (message, axoisJWT, accessToken) => {
  return axoisJWT.post(url + chatbot , {message, axoisJWT}, {
    headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420"
    }
})
}