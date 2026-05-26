import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import models from "../../modelData/models";
import "./styles.css";
import { matchPath, useLocation } from "react-router-dom";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const userMatch = matchPath({ path: "/users/:userId" }, location.pathname);
  const photoMatch = matchPath({ path: "/photos/:userId" }, location.pathname);
  const match = userMatch ?? photoMatch;
  const userId = match?.params?.userId;
  const user = userId ? models.userModel(userId) : null;
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Nguyen Duc Sinh - Photo_Sharing_App
          </Typography>
          {/* Hien thi detail o goc ben phai (o cung 1 hang voi topbar-appBar nhung o goc phai ngoai cung) */}
          <Typography variant="h5" color="inherit" className="topbar-detail">
            {user ? `Detail infomation of ${user.first_name} ${user.last_name}` : "Detail"}
          </Typography>
          
          
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
