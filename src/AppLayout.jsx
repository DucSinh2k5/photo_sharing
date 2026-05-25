// AppLayout.js
import { useState } from "react";
import { Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import DanhSachBaiViet from "./PostLists";
import BaiViet from "./Post";
import DangNhap from "./Login";
import ThongKe from "./Stats";
import TaoBaiVietMoi from "./NewPost";
import NguoiDung from "./User.jsx";
import TaoNguoiDungMoi from "./NewUser.jsx";
import TuyenDuongBaoVe from "./ProtectedRoute";
import GioiThieu from "./About.jsx"
import ThucDon from "./Menu.jsx"
import ChiTietThucDon from "./MenuDetails.jsx"
import Notification from "./Notification.jsx";
import TaoThongBaoMoi from "./NewNotification.jsx"
import Dudoan from "./Predict.jsx"
import Themmoidudoan from "./NewPredict.jsx"
import ChiTietDuDoan from "./PredictDetail.jsx"
import DangKy from "./Register.jsx"
import ThemmoiDangky from "./NewRegister.jsx";
const khoaLuuSessionNguoiDung = "simple-blog-user";
// Key localStorage dung de luu session gom user va token.

function docNguoiDungDaLuu() {
  // Doc user tu session da luu trong localStorage.
  try {
    const sessionDaLuu = JSON.parse(localStorage.getItem(khoaLuuSessionNguoiDung) || "null");
    // Session gom thong tin user va token dang nhap.
    return sessionDaLuu?.user && sessionDaLuu?.token ? sessionDaLuu.user : null;
  } catch {
    return null;
  }
}

function luuSessionDaDangNhap(phienDangNhap) {
  // Luu session hop le vao localStorage hoac xoa neu session rong.
  if (phienDangNhap?.user && phienDangNhap?.token) {
    localStorage.setItem(khoaLuuSessionNguoiDung, JSON.stringify(phienDangNhap));
  } else {
    localStorage.removeItem(khoaLuuSessionNguoiDung);
  }
}

export default function BoCucUngDung() {
  // Component bo cuc chinh gom thanh dieu huong va toan bo route cua app.
  const [nguoiDung, setNguoiDung] = useState(docNguoiDungDaLuu);
  // State user dang dang nhap tren frontend.
  const dieuHuong = useNavigate();
  // Ham dieu huong trang cua React Router.
  const laAdmin = nguoiDung?.role === "admin";
  // Bien cho biet user hien tai co vai tro admin hay khong.

  const capNhatSession = (phienDangNhap) => {
    // Cap nhat session moi sau khi dang nhap hoac dang xuat.
    setNguoiDung(phienDangNhap?.user || null);
    luuSessionDaDangNhap(phienDangNhap);
  };

  const dangXuat = () => {
    // Xoa session va dua user ve trang chu.
    capNhatSession(null);
    dieuHuong("/");
  };

  return (
    <>
      <nav style={{ margin: 10 }}>
        <Link to="/" style={{ padding: 5 }}>
          Home
        </Link>
        <Link to="/posts" style={{ padding: 5 }}>
          Posts
        </Link>

        
        {/* <Link to="/about" style={{ padding: 5 }}>
          About
        </Link> */}
        {/* <Link to="/user" style={{ padding: 5 }}>
          User
        </Link> */}
        {/* <Link to="/menu" style={{ padding: 5 }}>
          Menu
        </Link> */}
        <span> | </span>
        {nguoiDung && <span style={{ padding: 5 }}>Hi, {nguoiDung.name || nguoiDung.username}</span>}
        {/* {nguoiDung && (
          <Link to="/notification" style={{ padding: 5 }}>
            Notification
          </Link>
        )} */}
         {/* {nguoiDung && (
          <Link to="/newnotification" style={{ padding: 5 }}>
            New Notification
          </Link>
        )} */}
        {nguoiDung && (
          <Link to="/stats" style={{ padding: 5 }}>
            {" "}
            Stats{" "}
          </Link>
        )}
         {nguoiDung && (
          <Link to="/register" style={{ padding: 5 }}>
            {" "}
            Register{" "}
          </Link>
        )}
        {
          nguoiDung && (
            <Link to="/predict" style={{ padding: 5 }} >
              {" "}Predict{" "}
            </Link>
          )
        }
        {laAdmin && (
          <Link to="/newpost" style={{ padding: 5 }}>
            {" "}
            New Post{" "}
          </Link>
        )}
         {laAdmin && (
          <Link to="/newpredict" style={{ padding: 5 }}>
            {" "}
            New Predict{" "}
          </Link>
        )}
          {laAdmin && (
          <Link to="/newregister" style={{ padding: 5 }}>
            {" "}
            New Register{" "}
          </Link>
        )}
        {/* {laAdmin && (
          <Link to="/newuser" style={{ padding: 5 }}>
            {" "}
            New User{" "}
          </Link>
        )} */}
        {!nguoiDung && (
          <Link to="/login" style={{ padding: 5 }}>
            {" "}
            Login{" "}
          </Link>
        )}
        {nguoiDung && (
          <span onClick={dangXuat} style={{ padding: 5, cursor: "pointer" }}>
            {" "}
            Logout{" "}
          </span>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/posts" element={<Outlet />}>
          <Route index element={<DanhSachBaiViet />} />
          <Route path=":slug" element={<BaiViet />} />
        </Route>
        <Route path="/about" element={<GioiThieu user={nguoiDung} />} />
        <Route path="/predict" element={<Outlet />}>
          <Route index element={<Dudoan user={nguoiDung} />} />
          <Route path=":id" element={<ChiTietDuDoan />} />
        </Route>
        <Route
          path="/user"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <NguoiDung />
            </TuyenDuongBaoVe>
          }
        />
        <Route path="/menu" element={<Outlet />}>
          <Route index element={<ThucDon />} />
          <Route path=":name" element={<ChiTietThucDon />} />
        </Route>
        <Route path="/notification" element={<Notification />} />
        <Route path="/login" element={<DangNhap user={nguoiDung} onLogin={capNhatSession} />} />
        <Route
          path="/stats"
          element={
            <TuyenDuongBaoVe user={nguoiDung}>
              <ThongKe />
            </TuyenDuongBaoVe>
          }
        />
        
        <Route
          path="/newpost"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <TaoBaiVietMoi />
            </TuyenDuongBaoVe>
          }
        />
        <Route
          path="/register"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <DangKy />
            </TuyenDuongBaoVe>
          }
        />
         <Route
          path="/newnotification"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <TaoThongBaoMoi />
            </TuyenDuongBaoVe>
          }
        />
         <Route
          path="/newpredict"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <Themmoidudoan />
            </TuyenDuongBaoVe>
          }
        />
          <Route
          path="/newregister"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <ThemmoiDangky />
            </TuyenDuongBaoVe>
          }
        />
        <Route
          path="/newuser"
          element={
            <TuyenDuongBaoVe user={nguoiDung} allowedRoles={["admin"]}>
              <TaoNguoiDungMoi />
            </TuyenDuongBaoVe>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}
