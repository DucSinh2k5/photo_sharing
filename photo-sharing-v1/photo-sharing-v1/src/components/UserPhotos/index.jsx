import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

const imageModules = import.meta.glob("../../images/*", {
  eager: true,
  import: "default",
});

const imageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [
    path.split("/").pop(),
    url,
  ])
);

function UserPhotos() {
  const { userId } = useParams();

  const photos = models.photoOfUserModel(userId);

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="h5">Người dùng này chưa có ảnh nào.</Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Ảnh của người dùng
      </Typography>

      {photos.map((photo) => (
        <Card key={photo._id} sx={{ marginBottom: 4, boxShadow: 3 }}>
          <CardHeader
            title={`Ngày đăng: ${new Date(photo.date_time).toLocaleString()}`}
          />

          <CardMedia
            component="img"
            height="auto"
            image={imageMap[photo.file_name]}
            alt="User post"
            sx={{ objectFit: "contain", maxHeight: 500 }}
          />

          <CardContent>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Bình luận:
            </Typography>
            <Divider />

            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Box key={comment._id} sx={{ mt: 2, mb: 2, pl: 2 }}>
                  <Typography variant="subtitle2">
                    <Link
                      to={`/users/${comment.user._id}`}
                      style={{
                        fontWeight: "bold",
                        textDecoration: "none",
                        color: "#1976d2",
                      }}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    <span
                      style={{
                        color: "gray",
                        marginLeft: "10px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {new Date(comment.date_time).toLocaleString()}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.comment}
                  </Typography>
                  <Divider variant="inset" component="div" sx={{ mt: 1 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Chưa có bình luận nào cho ảnh này.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
