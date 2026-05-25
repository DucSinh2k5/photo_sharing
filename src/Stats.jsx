import { useEffect, useMemo, useState } from "react";

const baiVietRong = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
};

// Stats.js
export default function ThongKe() {
  // Component hien trang thong ke sau khi user dang nhap.
  const [danhSachBaiViet, setDanhSachBaiViet] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [thongBao, setThongBao] = useState("");
  const [boLocTacGia, setBoLocTacGia] = useState("");
  const [bieuMau, setBieuMau] = useState(baiVietRong);
  const [dangGui, setDangGui] = useState(false);
  const [dangSuaSlug, setDangSuaSlug] = useState("");

  const layTokenDaLuu = () => {
    try {
      const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
      return sessionDaLuu?.token || "";
    } catch {
      return "";
    }
  };

  const taiDanhSachBaiViet = async () => {
    try {
      setDangTai(true);
      setLoi("");

      const res = await fetch("http://localhost:8080/api/posts");
      const ketQua = await res.json();

      if (!res.ok) {
        throw new Error(ketQua.message || "Cannot load posts");
      }

      setDanhSachBaiViet(Array.isArray(ketQua) ? ketQua : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoi(error.message || "Cannot load posts");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSachBaiViet();
  }, []);

  const danhSachTacGia = useMemo(() => {
    const tapTacGia = new Set();
    danhSachBaiViet.forEach((baiViet) => {
      if (baiViet.author) {
        tapTacGia.add(baiViet.author);
      }
    });
    return Array.from(tapTacGia).sort();
  }, [danhSachBaiViet]);

  const danhSachHienThi = useMemo(() => {
    if (!boLocTacGia) {
      return danhSachBaiViet;
    }
    return danhSachBaiViet.filter((baiViet) => baiViet.author === boLocTacGia);
  }, [danhSachBaiViet, boLocTacGia]);

  const capNhatTruong = (truong) => (event) => {
    setBieuMau((giaTriCu) => ({ ...giaTriCu, [truong]: event.target.value }));
  };

  const datFormMoi = () => {
    setDangSuaSlug("");
    setBieuMau(baiVietRong);
    setThongBao("");
  };

  const batDauSua = async (slug) => {
    try {
      setThongBao("");
      const res = await fetch(`http://localhost:8080/api/post/${slug}`);
      const ketQua = await res.json();

      if (!res.ok) {
        throw new Error(ketQua.message || "Cannot load post");
      }

      setDangSuaSlug(slug);
      setBieuMau({
        title: ketQua.title || "",
        slug: ketQua.slug || "",
        excerpt: ketQua.excerpt || "",
        content: ketQua.content || "",
        author: ketQua.author || "",
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      setThongBao(error.message || "Cannot load post");
    }
  };

  const xuLyGuiForm = async (event) => {
    event.preventDefault();
    setThongBao("");

    if (!bieuMau.title.trim() || !bieuMau.content.trim()) {
      setThongBao("Title and content are required");
      return;
    }

    setDangGui(true);

    try {
      const url = dangSuaSlug
        ? `http://localhost:8080/api/post/${dangSuaSlug}`
        : "http://localhost:8080/api/post";
      const method = dangSuaSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${layTokenDaLuu()}`,
        },
        body: JSON.stringify(bieuMau),
      });

      const duLieuTraVe = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(duLieuTraVe.message || "Cannot save post");
      }

      setThongBao(duLieuTraVe.message || "Saved successfully");
      datFormMoi();
      await taiDanhSachBaiViet();
    } catch (error) {
      console.error("Error saving post:", error);
      setThongBao(error.message || "Cannot save post");
    } finally {
      setDangGui(false);
    }
  };

  const xoaBaiViet = async (slug) => {
    const dongY = window.confirm("Ban chac chan muon xoa bai viet nay?");
    if (!dongY) {
      return;
    }

    try {
      setThongBao("");
      const res = await fetch(`http://localhost:8080/api/post/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${layTokenDaLuu()}`,
        },
      });

      const duLieuTraVe = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(duLieuTraVe.message || "Cannot delete post");
      }

      setThongBao(duLieuTraVe.message || "Deleted successfully");
      await taiDanhSachBaiViet();
      if (dangSuaSlug === slug) {
        datFormMoi();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setThongBao(error.message || "Cannot delete post");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thong ke bai viet</h2>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="author-filter">Loc theo tac gia: </label>
        <select
          id="author-filter"
          value={boLocTacGia}
          onChange={(event) => setBoLocTacGia(event.target.value)}
        >
          <option value="">Tat ca</option>
          {danhSachTacGia.map((tacGia) => (
            <option key={tacGia} value={tacGia}>
              {tacGia}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={xuLyGuiForm} style={{ marginBottom: 18 }}>
        <h3>{dangSuaSlug ? "Sua bai viet" : "Them bai viet"}</h3>
        <div style={{ marginBottom: 8 }}>
          <label>Title:</label>
          <br />
          <input type="text" value={bieuMau.title} onChange={capNhatTruong("title")} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Slug (optional):</label>
          <br />
          <input type="text" value={bieuMau.slug} onChange={capNhatTruong("slug")} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Excerpt (optional):</label>
          <br />
          <input type="text" value={bieuMau.excerpt} onChange={capNhatTruong("excerpt")} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Author (optional):</label>
          <br />
          <input type="text" value={bieuMau.author} onChange={capNhatTruong("author")} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Content:</label>
          <br />
          <textarea
            rows={6}
            style={{ width: "100%", maxWidth: 640 }}
            value={bieuMau.content}
            onChange={capNhatTruong("content")}
          />
        </div>
        <button type="submit" disabled={dangGui}>
          {dangGui ? "Saving..." : dangSuaSlug ? "Update" : "Create"}
        </button>
        {dangSuaSlug && (
          <button type="button" onClick={datFormMoi} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
        {thongBao && <p style={{ marginTop: 8 }}>{thongBao}</p>}
      </form>

      {dangTai && <div>Loading...</div>}
      {loi && <div>{loi}</div>}
      {!dangTai && !loi && (
        <div>
          <p>So bai viet: {danhSachHienThi.length}</p>
          {danhSachHienThi.length === 0 ? (
            <div>Khong co bai viet.</div>
          ) : (
            <ul>
              {danhSachHienThi.map((baiViet) => (
                <li key={baiViet.id || baiViet.slug} style={{ marginBottom: 12 }}>
                  <strong>{baiViet.title}</strong>
                  <div>
                    <small>
                      By {baiViet.author || "Unknown"} | {new Date(baiViet.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div>{baiViet.excerpt}</div>
                  <div style={{ marginTop: 6 }}>
                    <button type="button" onClick={() => batDauSua(baiViet.slug)}>
                      Sua
                    </button>
                    <button
                      type="button"
                      onClick={() => xoaBaiViet(baiViet.slug)}
                      style={{ marginLeft: 8 }}
                    >
                      Xoa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
  
