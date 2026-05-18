import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./pages/home.jsx"
import Login from "./pages/login.jsx"
import Products from "./pages/products.jsx"

function app(){
  return(
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
      </Routes>
     </Router>
    </>
  )
}
export default app;