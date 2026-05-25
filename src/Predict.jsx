import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dudoan() {
	// Component hien danh sach bai viet.
	const [danhsachdudoan, setDanhSachDudoan] = useState([]);
	// State luu danh sach bai viet backend tra ve.
	const [dangTai, setDangTai] = useState(true);
	// State cho biet request lay bai viet dang chay hay khong.
	const [loi, setLoi] = useState("");
	// State luu thong bao loi khi lay bai viet that bai.

	useEffect(() => {
		(async () => {
			try {
				const phanHoi = await fetch("http://localhost:8080/api/predict");
				// Response tu API lay danh sach bai viet.
				const ketQua = await phanHoi.json();
				// Body JSON backend tra ve.

				if (!phanHoi.ok) {
					throw new Error(ketQua.message || "Cannot load predict");
				}

				setDanhSachDudoan(ketQua);
			} catch (loilaydudoan) {
				console.error("Error fetching data:", loilaydudoan);
				setLoi(loilaydudoan.message || "An error occurred while fetching the data.");
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

	return (
		<ul>
			{danhsachdudoan.map((predict) => (
				<li key={predict.id} style={{ marginBottom: 12 }}>
					<Link to ={`/predict/${predict.id}`}>
						<h3>{predict.name}</h3>
					</Link>
				</li>
			))}
		</ul>
	);
}
