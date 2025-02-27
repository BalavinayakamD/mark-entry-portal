import { Stack, TextField, Button, Typography,Box,Paper,Alert,} from "@mui/material";
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStore } from "../../store/Store";

const Login = () => {
  const [formData, setFormData] = useState({
    userid: "",
    email: "",
    password: "",
  });
  const { Role, setRole} = useStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempted with:", formData);
    setError("");

    try {
      const res = await axios.get("http://localhost:7000/api/fetch-login", {
        params: formData
      });
      console.log("Server response:", res.data);
      if (res.data.success) {
        console.log("Login successful:", res.data);
        console.log(res.data.user.roles);
        setRole(res.data.user.roles);
        navigate('/dashboard');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Failed to login:", err);
      if (err.response && err.response.status === 404) {
        setError("User not found. Please check your credentials.");
      } else if (err.response && err.response.status === 401) {
        setError("Invalid user. Please check your credentials.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fsfsfs",
      }}
    >
      <Paper elevation={5} sx={{ p: 4, width: "100%", maxWidth: "400px" }}>
        <Stack spacing={3} direction="column" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={2} width="100%">
              <TextField
                fullWidth
                label="UserId"
                name="userid"
                variant="outlined"
                value={formData.userid}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
