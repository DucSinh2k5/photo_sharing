import { use, useState } from "react";

const dangkyrong = {
    id: "",
    name: "",
    age: "",
    cv: "",
}
export default function ThemmoiDangky() {

    const [bieuMau, setBieuMau] = useState(dangkyrong);
    const [thongBao, setThongBao] = useState("");
    const layTokenDaLuu = () => {
        try {
            const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "");
            return sessionDaLuu?.token || "";
        }
        catch {
            return;
        }
    };

    const capNhatTruong = (truong) => (event) => {
        setBieuMau((giatricu) => ({ ...giatricu, [truong]: event.target.value }));
    };
    const xuLyGuiForm = async (event) =>{

        event.preventDefault();
        setThongBao("");
        if (!bieuMau.id || !bieuMau.name.trim()) {
            setThongBao("Thieu id");
        }
        const res = await fetch("http://localhost:8080/api/newregister",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${layTokenDaLuu()}`,
                },
                body: JSON.stringify(bieuMau)
            }
            
        );
        setBieuMau(dangkyrong)

    }
    return (
        <div>
            <form onSubmit={xuLyGuiForm}>
                {/* <div> */}
                <h3>Nhap id:</h3>
                <input type="number" value={bieuMau.id} onChange={capNhatTruong("id")}></input>
                <br></br>
                 <h3>Nhap name:</h3>
                 <input type="text" value={bieuMau.name} onChange={capNhatTruong("name")}></input>
                <br></br>
                 <h3>Nhap tuoi:</h3>
                 <input type="number" value={bieuMau.age} onChange={capNhatTruong("age")}></input>
                <br></br>
                 <h3>Nhap cv:</h3>
                 <input type="text" value={bieuMau.cv} onChange={capNhatTruong("cv")}></input>
                <br></br>
                <button>Gui</button>
                {/* </div> */}
            </form>
        </div>
    )
}