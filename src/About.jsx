import { useEffect, useState } from "react";

export default function GioiThieu({ user: nguoiDung }) {
    // Component hien thong tin gioi thieu va user dang dang nhap.
    const [thongTinDangNhap, setThongTinDangNhap] = useState(null);
    // State luu thong tin demo tra ve tu backend.
    const [dangTai, setDangTai] = useState(true);
    // State cho biet request about dang chay hay khong.
    const [loi, setLoi] = useState("");
    // State luu thong bao loi khi lay thong tin about that bai.

    useEffect(() => {
        (async () => {
            try {
                const phanHoi = await fetch("http://localhost:8080/api/about-login-user");
                // Response tu API thong tin dang nhap demo.
                const duLieuTraVe = await phanHoi.json().catch(() => ({}));
                // Body JSON backend tra ve.

                if (!phanHoi.ok) {
                    throw new Error(duLieuTraVe.message || "Cannot load about information");
                }

                setThongTinDangNhap(duLieuTraVe);
            } catch (loiLayThongTin) {
                console.error("Failed to load about information:", loiLayThongTin);
                setLoi(loiLayThongTin.message || "Cannot load about information");
            } finally {
                setDangTai(false);
            }
        })();
    }, []);

    if (dangTai) {
        return <div style={{ padding: 10 }}>Loading about information...</div>;
    }

    if (loi) {
        return <div style={{ padding: 10 }}>{loi}</div>;
    }

    return (
        <div style={{ padding: 10 }}>
            <h2>About</h2>
    
            <p>User hien tai tren frontend:</p>
            {nguoiDung ? (
                <ul>
                    <li>Username: {nguoiDung.username || "-"}</li>
                    <li>Name: {nguoiDung.name || "-"}</li>
                </ul>
            ) : (
                <p>Ban chua dang nhap.</p>
            )}
            {thongTinDangNhap?.users && <p>So tai khoan demo: {thongTinDangNhap.users.length}</p>}
        </div>
    );
}
