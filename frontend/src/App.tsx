import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/marketing/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* We’ll add /login and protected routes later */}
      </Routes>
    </BrowserRouter>
  );
}
