import React, { Fragment } from "react";
import {Card, List, ListItem, Typography} from "@mui/material";

import "./styles.css";
import {useParams} from "react-router-dom";
import models from "../../modelData/models";
/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const user = useParams();
  // console.log(user.userId)
  const users = models.userModel(user.userId);
    return (
        <>
          <Typography variant="body1">
            {/* This should be the UserDetail view of the PhotoShare app. Since it is
            invoked from React Router the params from the route will be in property match.
            So this should show details of user: {user.userId}.
            You can fetch the model for the user from models.userModel. */}
          {/* {user.userId} */}
          <Card className="the_ten">
            <Typography className="dau_muc" variant="h5"> <strong>Ten:</strong> {users.first_name} {users.last_name} </Typography>
            <Typography className="dau_muc"> <strong>Dia chi:</strong> {users.location} </Typography>
            <Typography className="dau_muc"><strong>Mo ta:</strong> {users.description} </Typography>
            <Typography className="dau_muc"><strong>Nghe nghiep:</strong> {users.occupation} </Typography>
            <button className="xem_anh">Xem chi tiet anh cua {users.first_name} {users.last_name} </button>
          </Card>
          {/* {users.first_name} */}
          </Typography>
        </>
    );
}

export default UserDetail;
