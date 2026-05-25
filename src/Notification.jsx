import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Notification() {

    const [danhsachthongbao, setDanhsachthongbao] = useState([]);
    const [loi, setLoi] = useState("")
    
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("http://localhost:8080/api/notification");
                const Ketqua = await res.json();

                if (!res.ok) {
                    throw new Error("Cannot load notification");

                }

                setDanhsachthongbao(Array.isArray(Ketqua) ? Ketqua : []);
            }catch(loiLayThongbao){
                console.error("Error fetching notifications", loiLayThongbao);
                setLoi("An error occurred while fetching notifications.");

            }
 
        })();
    }, []);
    if (loi) {
        return <div>{loi}</div>
    }

    return (
        <div>
            <h1>NOTIFICATION</h1>
            <ul>
        {danhsachthongbao.map((thongbao) => (
          <li key={thongbao.id || thongbao.name} style={{ marginBottom: 12 }}>
            <div>
                    <p>Name: {thongbao.name}</p>
                    <p>Nội dung: {thongbao.noidung}</p>
            </div>
          </li>
        ))}
      </ul>
        </div>
    );
}