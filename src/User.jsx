import { useEffect, useState } from "react";

export default function NguoiDung() {
  // Component hien danh sach user trong database cho admin.
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState([]);
  // State luu danh sach user backend tra ve.
  const [dangTai, setDangTai] = useState(true);
  // State cho biet request lay danh sach user dang chay hay khong.
  const [loi, setLoi] = useState("");
  // State luu thong bao loi khi lay danh sach user that bai.

  useEffect(() => {
    (async () => {
      try {
        const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
        // Session dang luu trong localStorage, dung de lay token.
        const phanHoi = await fetch("http://localhost:8080/api/user", {
          headers: {
            Authorization: `Bearer ${sessionDaLuu?.token || ""}`,
          },
        });
        // Response tu API lay danh sach user.
        const ketQua = await phanHoi.json();
        // Body JSON backend tra ve.

        if (!phanHoi.ok) {
          throw new Error(ketQua.message || "Cannot load users");
        }

        setDanhSachNguoiDung(Array.isArray(ketQua) ? ketQua : []);
      } catch (loiLayNguoiDung) {
        console.error("Error fetching users:", loiLayNguoiDung);
        setLoi(loiLayNguoiDung.message || "An error occurred while fetching users.");
      } finally {
        setDangTai(false);
      }
    })();
  }, []);

  if (dangTai) {
    return <div>Loading users...</div>;
  }

  if (loi) {
    return <div>{loi}</div>;
  }

  if (danhSachNguoiDung.length === 0) {
    return <div>No users found in database.</div>;
  }

  return (
    <div style={{ padding: 10 }}>
      <h2>Users Information</h2>
      <ul>
        {danhSachNguoiDung.map((nguoiDung) => (
          <li key={nguoiDung._id || nguoiDung.username} style={{ marginBottom: 12 }}>
            <div>
                    Name :{nguoiDung.name}
                    <br />
                    Age: {nguoiDung.age}
                    <br />
                    Address: {nguoiDung.address}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
