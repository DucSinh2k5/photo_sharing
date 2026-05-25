import { use, useState } from "react";
import { useEffect } from "react";

export default function DangKy() {


    const [dangky, setDangKy] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("http://localhost:8080/api/register");
                const ketQua = await res.json();
                console.log(ketQua);
                if (!res.ok) {
                    throw new Error("Cannot load predict");
                }
                setDangKy(ketQua);

            } catch (error){
                console.error("Error fetching data")
            }
        })()
    }, [])
    // console.log(da)
    return (
        <div>
            <ul>
                {
                    dangky.map((dky) => (
                        <li key={dky.id} style={{ marginBottom: 12 }}>
                            {/* <Link></Link> */}
                            <h3>{dky.name}</h3>
                            <h2>hello</h2>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}