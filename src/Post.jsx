// Post.js
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function BaiViet() {
  // Component hien chi tiet bai viet va khu vuc binh luan.
  const { slug } = useParams();
  // Slug bai viet lay tu URL.
  const dieuHuong = useNavigate();
  // Ham dieu huong cua React Router.
  const viTriHienTai = useLocation();
  // Route hien tai, dung de quay lai sau khi dang nhap.
  const [baiViet, setBaiViet] = useState(null);
  // State luu chi tiet bai viet.
  const [dangTai, setDangTai] = useState(true);
  // State cho biet request lay bai viet dang chay hay khong.
  const [loi, setLoi] = useState("");
  // State luu thong bao loi khi lay bai viet that bai.
  const [hienHopBinhLuan, setHienHopBinhLuan] = useState(false);
  // State dieu khien viec hien textarea binh luan.
  const [noiDungBinhLuan, setNoiDungBinhLuan] = useState("");
  // State luu noi dung comment nguoi dung nhap.
  const [loiBinhLuan, setLoiBinhLuan] = useState("");
  // State luu thong bao loi khi gui comment.
  const [dangGuiBinhLuan, setDangGuiBinhLuan] = useState(false);
  // State cho biet request gui comment dang chay hay khong.
  const [danhSachBinhLuan, setDanhSachBinhLuan] = useState([]);
  // State luu danh sach comment cua bai viet.

  const layNguoiDungDaLuu = () => {
    // Lay user tu session localStorage neu co token hop le ve mat frontend.
    try {
      const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
      // Session dang luu trong localStorage.
      return sessionDaLuu?.user && sessionDaLuu?.token ? sessionDaLuu.user : null;
    } catch {
      return null;
    }
  };

  const layTokenDaLuu = () => {
    // Lay token tu session localStorage de gui request comment.
    try {
      const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
      // Session dang luu trong localStorage.
      return sessionDaLuu?.token || "";
    } catch {
      return "";
    }
  };

  const yeuCauDangNhapDeBinhLuan = () => {
    // Kiem tra user da dang nhap truoc khi cho mo hoac gui comment.
    const nguoiDungDaLuu = layNguoiDungDaLuu();
    // User lay tu session localStorage.

    if (!nguoiDungDaLuu) {
      dieuHuong("/login", { state: { from: viTriHienTai } });
      return false;
    }

    return true;
  };

  const xacNhanBinhLuan = async () => {
    // Gui comment moi len backend.
    if (!yeuCauDangNhapDeBinhLuan()) {
      return;
    }

    const noiDung = noiDungBinhLuan.trim();
    // Noi dung comment sau khi trim khoang trang.

    if (!noiDung) {
      setLoiBinhLuan("Please enter a comment.");
      return;
    }

    setLoiBinhLuan("");
    setDangGuiBinhLuan(true);

    try {
      const phanHoi = await fetch("http://localhost:8080/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${layTokenDaLuu()}`,
        },
        body: JSON.stringify({
          slug,
          content: noiDung,
        }),
      });
      // Response tu API tao comment.
      const duLieuTraVe = await phanHoi.json().catch(() => ({}));
      // Body JSON backend tra ve sau khi tao comment.

      if (!phanHoi.ok) {
        setLoiBinhLuan(duLieuTraVe.message || "Comment failed!");
        return;
      }

      if (Array.isArray(duLieuTraVe.comments)) {
        setDanhSachBinhLuan(duLieuTraVe.comments);
      } else if (duLieuTraVe.comment) {
        setDanhSachBinhLuan((danhSachCu) => [duLieuTraVe.comment, ...danhSachCu]);
      }

      setNoiDungBinhLuan("");
      setHienHopBinhLuan(false);
    } catch (loiGuiBinhLuan) {
      console.error("Comment error:", loiGuiBinhLuan);
      setLoiBinhLuan("Comment failed!");
    } finally {
      setDangGuiBinhLuan(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setDangTai(true);
        setLoi("");

        const phanHoi = await fetch(`http://localhost:8080/api/post/${slug}`);
        // Response tu API lay chi tiet bai viet.
        const ketQua = await phanHoi.json();
        // Body JSON backend tra ve.

        if (!phanHoi.ok) {
          throw new Error(ketQua.message || "Post not found");
        }

        setBaiViet(ketQua);
        setDanhSachBinhLuan(Array.isArray(ketQua.comments) ? ketQua.comments : []);
      } catch (loiLayBaiViet) {
        console.error("Error fetching data:", loiLayBaiViet);
        setLoi(loiLayBaiViet.message || "Failed to load post");
      } finally {
        setDangTai(false);
      }
    })();
  }, [slug]);

  if (dangTai) {
    return <div style={{ padding: 20 }}>Loading post...</div>;
  }

  if (loi) {
    return <div style={{ padding: 20 }}>{loi}</div>;
  }

  if (!baiViet) {
    return <div style={{ padding: 20 }}>Post not found</div>;
  }

  const xuLyBamBinhLuan = () => {
    // Mo hoac dong hop binh luan sau khi dam bao user da dang nhap.
    if (!yeuCauDangNhapDeBinhLuan()) {
      return;
    }

    setHienHopBinhLuan((giaTriCu) => !giaTriCu);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{baiViet.title}</h2>
      <p>
        <em>
          By {baiViet.author} | {new Date(baiViet.createdAt).toLocaleString()}
        </em>
      </p>
      <p>{baiViet.excerpt}</p>
      <p>{baiViet.content}</p>

      {/* <button onClick={xuLyBamBinhLuan}>
        Comment
      </button> */}

      {hienHopBinhLuan && (
        <div style={{ marginTop: 12 }}>
          <textarea
            rows={3}
            style={{ width: "100%", maxWidth: 520 }}
            value={noiDungBinhLuan}
            onChange={(event) => {
              setNoiDungBinhLuan(event.target.value);
              if (loiBinhLuan) {
                setLoiBinhLuan("");
              }
            }}
            placeholder="Write your comment..."
          />
          {loiBinhLuan && <p style={{ color: "crimson", margin: "4px 0" }}>{loiBinhLuan}</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={xacNhanBinhLuan} disabled={dangGuiBinhLuan}>
              {dangGuiBinhLuan ? "Sending..." : "Confirm"}
            </button>
            <button
              onClick={() => {
                setHienHopBinhLuan(false);
                setNoiDungBinhLuan("");
                setLoiBinhLuan("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {danhSachBinhLuan.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h4>Comments</h4>
          {danhSachBinhLuan.map((binhLuan) => (
            <div
              key={binhLuan._id || binhLuan.id || binhLuan.createdAt}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            >
              <p style={{ margin: 0 }}>{binhLuan.content}</p>
              <small>
                {binhLuan.author || "Anonymous"} | {new Date(binhLuan.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
