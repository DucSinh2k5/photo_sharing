// NewPost.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const nguoiDungRong = {
// Gia tri mac dinh cua form tao user moi.
    name: "",
    age: "",
    address: "",
};

export default function TaoNguoiDungMoi() {
  // Component hien form tao user moi cho admin.
  const [bieuMau, setBieuMau] = useState(nguoiDungRong);
  // State luu toan bo du lieu form user.
  const [thongBao, setThongBao] = useState("");
  // State luu thong bao thanh cong hoac loi.
  const [dangGui, setDangGui] = useState(false);
  // State cho biet request tao user dang chay hay khong.
  const dieuHuong = useNavigate();
  // Ham dieu huong sau khi tao user thanh cong.

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
    // Xu ly submit form tao user moi.
    event.preventDefault();
    setThongBao("");

    if (!bieuMau.name.trim()) {
      setThongBao("Name are required");
      return;
    }

    setDangGui(true);

    try {
      const phanHoi = await fetch("http://localhost:8080/api/newuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${layTokenDaLuu()}`,
        },
        body: JSON.stringify(bieuMau),
      });
      // Response tu API tao user.
      
      const duLieuTraVe = await phanHoi.json().catch(() => ({}));
      // Body JSON backend tra ve sau khi tao user.

      const taoThanhCong = phanHoi.ok;
      // Bien cho biet backend da tao user thanh cong hay chua.
      setThongBao(
        duLieuTraVe.message ||
          (taoThanhCong ? "User created successfully!" : "User created failed!")
      );

      if (!taoThanhCong) {
        return;
      }

      setBieuMau(nguoiDungRong);
      dieuHuong("/user");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <form onSubmit={xuLyGuiForm}>
      <div style={{ padding: 10 }}>
        <span>Name: </span>
        <br />
        <input type="text" value={bieuMau.name} onChange={capNhatTruong("name")} />
        <br />

        <span>Age: </span>
        <br />
        <input type="number" value={bieuMau.age} onChange={capNhatTruong("age")} />
        <br />

        <span>Address:</span>
        <br />
        <input type="text" value={bieuMau.address} onChange={capNhatTruong("address")} />
        <br />

      
        <button type="submit" disabled={dangGui}>
          {dangGui ? "Saving..." : "Add New"}
        </button>
        <p className="text-success">{thongBao}</p>
      </div>
    </form>
  );
}
