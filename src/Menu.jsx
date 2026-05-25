import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ThucDon() {
  // Component hien danh sach menu trong database.
  const [danhSachThucDon, setDanhSachThucDon] = useState([]);
  // State luu danh sach menu backend tra ve.
  const [dangTai, setDangTai] = useState(true);
  // State cho biet request lay menu dang chay hay khong.
  const [loi, setLoi] = useState("");
  // State luu thong bao loi khi lay menu that bai.

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/menu");
        // Response tu API lay danh sach menu.
        const ketQua = await res.json();
        // Body JSON backend tra ve.

        if (!res.ok) {
          throw new Error("Cannot load menus");
        }

        setDanhSachThucDon(Array.isArray(ketQua) ? ketQua : []);
      } catch (loiLayThucDon) {
        console.error("Error fetching menus:", loiLayThucDon);
        setLoi("An error occurred while fetching menus.");
      } finally {
        setDangTai(false);
      }
    })();
  }, []);

  if (dangTai) {
    return <div>Loading menus...</div>;
  }

  if (loi) {
    return <div>{loi}</div>;
  }

  if (danhSachThucDon.length === 0) {
    return <div>No menus found in database.</div>;
  }

  return (
    <div style={{ padding: 10 }}>
      <h2>Menu Information</h2>
      <ul>
        {danhSachThucDon.map((thucDon) => (
          <li key={thucDon._id || thucDon.name} style={{ marginBottom: 12 }}>
            <div>
              <Link to={`/menu/${encodeURIComponent(thucDon.name)}`}>
                <h3>{thucDon.name}</h3>
              </Link>
              <p>Price: {thucDon.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
