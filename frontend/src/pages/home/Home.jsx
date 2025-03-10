import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <Box height="100vh" backgroundColor="#00000">
      <Stack direction={"column"} spacing={5} mt={10} mx={10}>
        <Typography variant="h2" className="text-center !important" sx={{fontSize:{xs:"2rem",sm:"2rem",md:"3rem",lg:"4rem",xl:"5rem"}}}>
          Welcome To The Marks Management System !
        </Typography>
        <Typography variant="h5" sx={{fontSize:{xs:"1rem",sm:"1rem",md:"1.5rem",lg:"1.5rem",xl:"2rem"}}}>
          Here you can add the marks of your students and manage them.
        </Typography>
        <Typography variant="h5" sx={{fontSize:{xs:"1rem",sm:"1rem",md:"1.5rem",lg:"1.5rem",xl:"2rem"}}}>
          This system makes it easy and reliable to manage the marks of your
          students by ensuring Roles.
        </Typography>
        <Typography variant="h5"  sx={{fontSize:{xs:"1rem",sm:"1rem",md:"1.5rem",lg:"1.5rem",xl:"2rem"}}}>
          The Roles are decided by your Institution.
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={5} mt={10} mx={10} justifyContent = "space-around">
        <Button onClick={() => navigate("/login")} sx = {{'&:hover':{backgroundColor:"transparent !important",color:"white !important"}}} variant="contained">Login</Button>
      </Stack>
    </Box>
  );
}
export default Home;
