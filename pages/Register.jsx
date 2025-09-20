import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }
  
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        body: formData, // Use the FormData directly
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Registered successfully! You can log in now.");
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  }  

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Create Account</h2>
          <form onSubmit={handleRegister} encType="multipart/form-data">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>
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
                minLength="6"
              />
            </div>
            <div className="mb-3">
              <p>Set Profile picture</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2">
              Sign Up
            </button>
          </form>
          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}