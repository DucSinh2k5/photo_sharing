import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function DangNhap({ user: nguoiDung, onLogin: khiDangNhap }) {
	// Component hien form dang nhap va luu session khi backend tra token.
	const [tenDangNhap, setTenDangNhap] = useState("");
	// State luu username nguoi dung nhap.
	const [matKhau, setMatKhau] = useState("");
	// State luu password nguoi dung nhap.
	const [loi, setLoi] = useState("");
	// State luu thong bao loi dang nhap.
	const [dangTai, setDangTai] = useState(false);
	// State cho biet request login dang chay hay khong.
	const viTriHienTai = useLocation();
	// Thong tin route hien tai, dung de quay lai trang truoc login.
	const dieuHuong = useNavigate();
	

	if (nguoiDung) {
		return <Navigate to={"/stats"} replace />;
	}
	

	const xuLyGuiForm = async (event) => {
		// Xu ly submit form dang nhap va goi API login.
		event.preventDefault();
		setDangTai(true);
		setLoi("");

		try {
			const res = await fetch("http://localhost:8080/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: tenDangNhap, password: matKhau }),
			});
			// Response login tu backend.
			const duLieuTraVe = await res.json().catch(() => ({}));
			// Body JSON backend tra ve gom user va token.
			
			if (!res.ok) {
				setLoi("Invalid username or password!");
				return;
			}

			if (khiDangNhap) {
				khiDangNhap({
					user: duLieuTraVe.user,
					token: duLieuTraVe.token,
				});
			}
			dieuHuong("/stats", { replace: true });
		} catch (loiDangNhap) {
			console.error("Login error:", loiDangNhap);
			setLoi("Login failed!");
		} finally {
			setDangTai(false);
		}
	};

	return (
		<form onSubmit={xuLyGuiForm} style={{ padding: 10 }}>
			<br />
			<span>Username:</span>
			<br />
			<input type="text" value={tenDangNhap} onChange={(event) => setTenDangNhap(event.target.value)} />
			<br />
			<span>Password:</span>
			<br />
			<input
				type="password"
				value={matKhau}
				onChange={(event) => setMatKhau(event.target.value)}
			/>
			<br />
			<br />
			<button type="submit" disabled={dangTai}>
				{dangTai ? "Checking..." : "Login"}
			</button>
			<p>{loi}</p>
		</form>
	);
}
