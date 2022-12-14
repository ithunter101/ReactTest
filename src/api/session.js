import axios from "axios";
import BASE_URL from "service";

const login = async (userid, password) => {
  const res = await axios.post(
    `${BASE_URL}/api/tools_user/login`,
    { username: userid, pwd: password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

export default login;
