import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DanhSachBaiViet() {
	// Component hien danh sach bai viet.
	const [danhSachBaiViet, setDanhSachBaiViet] = useState([]);
	// State luu danh sach bai viet backend tra ve.
	const [dangTai, setDangTai] = useState(true);
	// State cho biet request lay bai viet dang chay hay khong.
	const [loi, setLoi] = useState("");
	// State luu thong bao loi khi lay bai viet that bai.

	useEffect(() => {
		(async () => {
			try {
				const phanHoi = await fetch("http://localhost:8080/api/posts");
				// Response tu API lay danh sach bai viet.
				const ketQua = await phanHoi.json();
				// Body JSON backend tra ve.

				if (!phanHoi.ok) {
					throw new Error(ketQua.message || "Cannot load posts");
				}

				setDanhSachBaiViet(ketQua);
			} catch (loiLayBaiViet) {
				console.error("Error fetching data:", loiLayBaiViet);
				setLoi(loiLayBaiViet.message || "An error occurred while fetching the data.");
			} finally {
				setDangTai(false);
			}
		})();
	}, []);

	if (dangTai) {
		return <div>Loading...</div>;
	}

	if (loi) {
		return <div>{loi}</div>;
	}

	if (danhSachBaiViet.length === 0) {
		return <div>No posts yet.</div>;
	}

	return (
		<ul>
			{danhSachBaiViet.map((baiViet) => (
				<li key={baiViet.id || baiViet.slug} style={{ marginBottom: 12 }}>
					<Link to={`/posts/${baiViet.slug}`}>
						<h3>{baiViet.title}</h3>
					</Link>
					<p>{baiViet.excerpt}</p>
					<small>
						By {baiViet.author} | {new Date(baiViet.createdAt).toLocaleString()}
					</small>
				</li>
			))}
		</ul>
	);
}
