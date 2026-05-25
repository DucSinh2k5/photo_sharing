import { Navigate, useLocation } from "react-router-dom";

function TuyenDuongBaoVe({ user: nguoiDung, allowedRoles: vaiTroDuocPhep = [], children: noiDungCon }) {
	// Component chan route neu user chua dang nhap hoac khong du vai tro.
	const viTriHienTai = useLocation();
	// Route hien tai de gui sang trang login va quay lai sau khi dang nhap.

	if (!nguoiDung) {
		return <Navigate to="/login" state={{ from: viTriHienTai }} replace />;
	}

	if (vaiTroDuocPhep.length > 0 && !vaiTroDuocPhep.includes(nguoiDung.role)) {
		return <Navigate to="/posts" replace />;
	}

	return noiDungCon;
}

export default TuyenDuongBaoVe;
