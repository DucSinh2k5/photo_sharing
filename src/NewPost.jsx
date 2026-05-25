// NewPost.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const baiVietRong = {
// Gia tri mac dinh cua form tao bai viet moi.
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
};

export default function TaoBaiVietMoi() {
  // Component hien form tao bai viet moi cho admin.
  const [bieuMau, setBieuMau] = useState(baiVietRong);
  // State luu toan bo du lieu form bai viet.
  const [thongBao, setThongBao] = useState("");
  // State luu thong bao thanh cong hoac loi.
  const [dangGui, setDangGui] = useState(false);
  // State cho biet request tao bai viet dang chay hay khong.
  const dieuHuong = useNavigate();
  // Ham dieu huong sau khi tao bai viet thanh cong.

  const layTokenDaLuu = () => {
    // Lay token dang nhap tu localStorage de gui len backend.
    try {
      const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
      // Session hien dang luu trong localStorage.
      return sessionDaLuu?.token || "";
    } catch {
      return "";
    }
  };

  const capNhatTruong = (truong) => (event) => {
    // Cap nhat mot field trong form theo ten field truyen vao.
    setBieuMau((giaTriCu) => ({ ...giaTriCu, [truong]: event.target.value }));
  };

  const xuLyGuiForm = async (event) => {
    // Xu ly submit form tao bai viet moi.
    event.preventDefault();
    setThongBao("");

    if (!bieuMau.title.trim() || !bieuMau.content.trim()) {
      setThongBao("Title and content are required");
      return;
    }

    setDangGui(true);

    try {
      const res = await fetch("http://localhost:8080/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${layTokenDaLuu()}`,
        },
        body: JSON.stringify(bieuMau),
      });
      // Response tu API tao bai viet.
      
      const duLieuTraVe = await res.json().catch(() => ({}));
      // Body JSON backend tra ve sau khi tao bai viet.

      // const taoThanhCong = phanHoi.ok;
      // // Bien cho biet backend da tao bai viet thanh cong hay chua.
      // setThongBao(
      //   duLieuTraVe.message ||
      //     (taoThanhCong ? "Post created successfully!" : "Post created failed!")
      // );
      const taoThanhCong = res.ok;
      setThongBao(
        duLieuTraVe.message || (taoThanhCong ? "Post created successfully!" : "Post created failed!")
      );
      if (!taoThanhCong) {
        return;
      }

      setBieuMau(baiVietRong);
      dieuHuong(`/posts/${duLieuTraVe.post.slug}`);
    } finally {
      setDangGui(false);
    }
  };

  return (
    <form onSubmit={xuLyGuiForm}>
      <div style={{ padding: 10 }}>
        <span>Title:</span>
        <br />
        <input type="text" value={bieuMau.title} onChange={capNhatTruong("title")} />
        <br />

        <span>Slug (optional):</span>
        <br />
        <input type="text" value={bieuMau.slug} onChange={capNhatTruong("slug")} />
        <br />

        <span>Excerpt (optional):</span>
        <br />
        <input type="text" value={bieuMau.excerpt} onChange={capNhatTruong("excerpt")} />
        <br />

        <span>Content:</span>
        <br />
        <textarea
          rows={6}
          style={{ width: "100%", maxWidth: 520 }}
          value={bieuMau.content}
          onChange={capNhatTruong("content")}
        />
        <br />

        <span>Author (optional):</span>
        <br />
        <input type="text" value={bieuMau.author} onChange={capNhatTruong("author")} />

        <br />
        <button type="submit" disabled={dangGui}>
          {dangGui ? "Saving..." : "Add New"}
        </button>
        <p className="text-success">{thongBao}</p>
      </div>
    </form>
  );
}
