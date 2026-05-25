import { useState } from "react";
import { useNavigate } from "react-router-dom";

const predictrong = {
    id :"",
    name :"",
    input : "",
    output : "",
}

export default function Themmoidudoan() {
    const [bieuMau, setBieuMau] = useState(predictrong);
    const [thongBao, setThongBao] = useState("");
    const dieuHuong = useNavigate();

    const layTokenDaLuu = () => {
        try {
            const sessionDaLuu = JSON.parse(localStorage.getItem("simple-blog-user") || "null");
            return sessionDaLuu?.token || "";
        }
        catch {
            return "";
        }
    };

    const capNhatTruong = (truong) => (event) => {
        setBieuMau((giaTricu) => ({ ...giaTricu, [truong]: event.target.value }));
    }


    const xuLyGuiForm = async (event) => {
        event.preventDefault();
        setThongBao("");

        if (!bieuMau.id || !bieuMau.name.trim()) {
            setThongBao("Predict need id and name");
            return
        }

        try {
            const res = await fetch("http://localhost:8080/api/newpredict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${layTokenDaLuu()}`,
                },
                body: JSON.stringify(bieuMau)
            });
            const duLieuTraVe = await res.json.catch(() => ({}));
            const taoThanhCong = res.ok;

            setThongBao(
                duLieuTraVe.message || (taoThanhCong ? "Post created successfully!" : "Post created failed!")
            );
            if (!taoThanhCong) {
                return;
            }

            setBieuMau(predictrong);
            dieuHuong(`/predict`)

        }
        finally {
            
        }
    };

    return (
        <form onSubmit={xuLyGuiForm}>
            <div style={{ padding: 10 }}>
                <span>Id: </span>
                <br />
                <input type="Number" value={bieuMau.id} onChange={capNhatTruong("id")} ></input>
                <br />
                <span>Name: </span>
                <br />
                <input type="text" value={bieuMau.name} onChange={capNhatTruong("name")} ></input>
                <br />
                <span>Input: </span>
                <br />
                <input type="text" value={bieuMau.input} onChange={capNhatTruong("input")} ></input>
                <br />
                <span>Output: </span>
                <br />
                <input type="text" value={bieuMau.output} onChange={capNhatTruong("output")} ></input>
                <br />
                <button type="submit" >Nop</button>
            </div>
        </form>
    );

};