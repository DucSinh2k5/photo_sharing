import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ChiTietThucDon() {
  // Component hien chi tiet mot mon trong menu.
  const { name: tenThucDon } = useParams();
  // Ten menu lay tu URL param.
  const [thucDon, setThucDon] = useState(null);
  // State luu chi tiet menu backend tra ve.
  const [dangTai, setDangTai] = useState(true);
  // State cho biet request lay chi tiet menu dang chay hay khong.
  const [loi, setLoi] = useState("");
  // State luu thong bao loi khi lay chi tiet menu that bai.

  useEffect(() => {
    (async () => {
      try {
        setDangTai(true);
        setLoi("");

        const phanHoi = await fetch(
          `http://localhost:8080/api/menu/${encodeURIComponent(tenThucDon || "")}`
        );
        // Response tu API lay chi tiet menu.
        const ketQua = await phanHoi.json();
        // Body JSON backend tra ve.

        if (!phanHoi.ok) {
          throw new Error(ketQua.message || "Menu not found");
        }

        setThucDon(ketQua || null);
      } catch (loiLayThucDon) {
        console.error("Error fetching data:", loiLayThucDon);
        setLoi(loiLayThucDon.message || "Failed to load menu");
      } finally {
        setDangTai(false);
      }
    })();
  }, [tenThucDon]);

  if (dangTai) {
    return <div style={{ padding: 20 }}>Loading menu...</div>;
  }

  if (loi) {
    return <div style={{ padding: 20 }}>{loi}</div>;
  }

  if (!thucDon) {
    return <div style={{ padding: 20 }}>Menu not found</div>;
  }

  return (
      <div style={{ padding: 20 }}>
          <div>
              <h2>{thucDon.name}</h2>
          <p>Price: {thucDon.price}</p>
        </div>
      
          
        <button>
            Dat hang  
        </button>
    </div>
  );
}
