import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../reducers/authReducer";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  async function handleLogin(e) {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log("Login response:", data);
        
        // Correctly access user data from data.user
        dispatch(login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar, // ✅ Add this line
          preferences: data.preferences
        }));
        
        toast.success(`Welcome back, ${data.user.name}!`, { autoClose: 3000 });

        // Redirect based on role
        if (data.user.role) {
          navigate("/" + data.user.role.toLowerCase());
        } 
      } else {
        const error = await response.json();
        toast.error(error.message || "Invalid credentials", { autoClose: 4000 });
      }
    } catch (error) {
      toast.error("Network error: " + error.message, { autoClose: 5000 });
    }
  } // Added missing closing brace for handleLogin function

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Log In</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2">
              Log In
            </button>
          </form>
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-decoration-none">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}