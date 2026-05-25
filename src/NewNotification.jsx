import { useState } from "react";
import { useNavigate } from "react-router-dom";

const thongbaorong = {
    id: "",
    name: "",
    noidung: "",
};

export default function TaoThongBaoMoi() {
    const [bieuMau, setBieuMau] = useState(thongbaorong);
    const [noti, setNoti] = useState("");
    const dieuHuong = useNavigate();

    const layTokenDaLuu = () => {
        try {
            const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
            return sessionDaLuu?.token || "";
        } catch {
            return "";
        }
    };
    const capNhatTruong = (truong)=> (event) => {
        setBieuMau((giatriCu) => ({ ...giatriCu, [truong]: event.target.value }));
    };
 
    const xuLyGuiForm = async (event) => {
        event.preventDefault();
        const id = Number(bieuMau.id);

        if (!Number.isFinite(id) || id <= 0 || !bieuMau.name.trim() || !bieuMau.noidung.trim()) {
            setNoti("Id, name and noidung are required");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/newnotification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${layTokenDaLuu()}`,
                },
                body: JSON.stringify({ ...bieuMau, id }),
            });
            const duLieuTraVe = await res.json().catch(() => ({}));
            const taoThanhCong = res.ok;
            setNoti(
                duLieuTraVe.message || (taoThanhCong ? "Notification created successfully!" : "Can not create new Notification")
            
            );
            if (!taoThanhCong) {
                return;
            }
            setBieuMau(thongbaorong);
            dieuHuong(`/notification`)
        } finally {

        };
    };
    return (
        <form onSubmit={xuLyGuiForm}>
             <div style={{ padding: 10 }}>
        <span>Id:</span>
        <br />
        <input type="text" value={bieuMau.id} onChange={capNhatTruong("id")} />
        <br />

        <span>Name:</span>
        <br />
        <input type="text" value={bieuMau.name} onChange={capNhatTruong("name")} />
        <br />

        <span>Noi dung:</span>
        <br />
        <input type="text" value={bieuMau.noidung} onChange={capNhatTruong("noidung")} />
        <br />

        

        
        <button type="submit" >
          Submit
        </button>
        <p className="text-success">{noti}</p>
      </div>
        </form>
    )
}