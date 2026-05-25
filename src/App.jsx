// App.js
import { BrowserRouter  } from "react-router-dom";
import BoCucUngDung from "./AppLayout";

function UngDung() {
  // Component goc boc app bang BrowserRouter de React Router hoat dong.
  return (
    <BrowserRouter>
      <BoCucUngDung />
    </BrowserRouter>
  ); 
}

export default UngDung;
