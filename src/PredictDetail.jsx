import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function ChiTietDuDoan() {
    const { id } = useParams();
    const [dudoan, setDudoan] = useState("");
    const [loi, setLoi] = useState("");
    const [ktra, setKiemtra] = useState("");
    const [input, setInput] = useState("");


    useEffect(() => {
        (async () => {
            try {
                setLoi("");
                const res = await fetch(
                    `http://localhost:8080/api/predict/${id}`
                );
                const ketQua = await res.json();
                if (!res.ok) {
                    throw new Error("Predict not found");
                }
                setDudoan(ketQua);
            }
            catch (error) {
                setLoi("Khong the load predict");
            }
        })();
    }, [id])

    const layinput = (event) => {
        setInput(event.target.value);
    };

    const gan = () => {
        const userInput = String(input || "").trim();
        const expected = String(dudoan?.input || "").trim();

        if (!expected) {
            setKiemtra("Chua co du doan");
            return;
        }

        setKiemtra(userInput === expected ? "Du doan dung" : "Du doan sai");
    };
    return (
        <div style={{ padding: 20 }}>
            <div>
                <h2>{dudoan.name}</h2>
            </div>
            {loi && <div>{loi}</div>}
            <h3>Nhap input:</h3>
            <input type="text" value={input} onChange={layinput} />
            <br />
            {ktra && <div>{ktra}</div>}
            
            <button type="button" onClick={gan}>
                Du doan
            </button>
            
        </div>
    );


    
}