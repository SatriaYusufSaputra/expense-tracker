import { useState } from "react";
import { loginUser, registerUser } from "../utils/authService";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  // field: name, email, password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const result = isLogin
      ? await loginUser(email, password)
      : await registerUser(name, email, password);

    if (result.token) {
      localStorage.setItem("token", result.token);
      const username = result.name || name;
      localStorage.setItem("userName", username);
      onLogin(username); // kasih tahu App.jsx bahwa sudah login
    } else {
      alert(result.message);
    }
  };

  // JSX: form login/register + toggle antar keduanya
  return (
    <div className="auth-form">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {!isLogin && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</button>
      <p
        onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {isLogin
          ? "Don't have an account? Register here."
          : "Already have an account? Login here."}
      </p>
    </div>
  );
}
