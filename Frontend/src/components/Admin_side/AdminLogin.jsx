import React, { useState } from 'react';
import backgroundImage from "/images/Login&RegisterBackground.jpg";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Base_URL } from '../../config/credentials';

const AdminLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    event.preventDefault();
    if (email.trim().length && password.trim().length) {
      const response = await axios.post(`${Base_URL}/admin/login`, { email, password });
      if (response.data === "Wrong email") {
        toast.error("Entered email is wrong please check your email.");
      } else if (response.data === "Wrong password") {
        toast.error("Entered password is wrong please check your password.");
      } else {
        const adminToken = response.data;
        sessionStorage.setItem("adminToken", adminToken);
        navigate("/admin/dashboard");
      }
    } else {
      toast.warning("All fields are required.");
    }
  }

  return (
    <>
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
              <div className="card card-plain mt-8">
                <div className="card-header pb-0 text-left bg-transparent">
                  <h3 className="font-weight-bolder text-info text-gradient">Hello Admin</h3>
                  <p className="mb-0">Enter your email and password to sign in.</p>
                </div>
                <div className="card-body">
                  <form onSubmit={() => handleLogin()}>
                    <label>Email</label>
                    <input type="text" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="btn bg-gradient-info w-100 mt-2 mb-0 text-center">Sign in</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8" >
                <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" style={{ backgroundImage: `url(${backgroundImage})` }}>
                  <span className="mask bg-gradient-primary opacity-8"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;