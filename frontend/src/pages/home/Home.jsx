import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <Box height="100vh" backgroundColor="#00000">
      <Stack direction={"column"} spacing={5} mt={10} mx={10}>
        <Typography variant="h2" className="text-center ">
          Welcome To The Marks Management System !
        </Typography>
        <Typography variant="h5">
          Here you can add the marks of your students and manage them.
        </Typography>
        <Typography variant="h5">
          This system makes it easy and reliable to manage the marks of your
          students by ensuring Roles.
        </Typography>
        <Typography variant="h5">
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
