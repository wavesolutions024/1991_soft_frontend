import { useContext, useState } from "react";
import "./Login.scss";
import { UserContext } from "../../Context";
import { api } from "../../Api";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [password, setPassword] = useState(false);
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { franchiesData,setLoader } = useContext(UserContext);

  const login = async (e) => {
    try {
      setLoader(true)
      e.preventDefault();
      if (!form.username) {
        setError({
          username: "Username requried",
        });
        return;
      } else if (!form.password) {
        setError({
          password: "Password requried",
        });
        return;
      }

      const response = await api.post("api/franchies/login", {
        username: form.username,
        password: form.password,
      });

      if (response.status === 200) {
        localStorage.setItem("isLoggedIn", true);
        franchiesData();
        navigate("/");
      }
    } catch (error) {
      if (error.response.data.message === "Password Invalid") {
        setError({
          password: error.response.data.message,
        });
      }
      if (error.response.data.message === "User not found") {
        setError({
          username: error.response.data.message,
        });
      }
      console.log(error.response.data.message);
    }finally{
      setLoader(false)
    }
  };

  return (
    <div className="login_parent">
      <form onSubmit={login} className="login_cont">
        <h1>Login</h1>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            id="username"
            type="text"
            placeholder="Enter your username"
          />
          <small>{error.username} </small>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div class="input">
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              id="password"
              type={password ? "password" : "text"}
              placeholder="Enter your password"
            />
            <span className="eye_btn" onClick={() => setPassword(!password)}>
              {password ? <IoMdEye /> : <IoIosEyeOff />}
            </span>
          </div>
          <small>{error.password}</small>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
