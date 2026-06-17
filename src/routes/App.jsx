import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import { Homepage } from "../pages/Homepage";
import { Error404 } from "../pages/errors/Error404";
import { Minuman } from "../pages/product/Minuman";
import { Makanan } from "../pages/product/Makanan";
import { Categories } from "../pages/categories/Categories";
import { OrderBrand } from "../pages/order/OrderBrand";

// Components

export const App = () => {
  return (
    <BrowserRouter>
      {/* <AnimatePresence mode="wait"> */}
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />

        {/* Categories */}
        <Route path="/kategori" element={<Categories />} />

        {/* Product: pilih brand */}
        <Route path="/minuman" element={<Minuman />} />
        <Route path="/makanan" element={<Makanan />} />

        {/* Product: form pesan per brand */}
        <Route path="/:categoryId/:brandId" element={<OrderBrand />} />

        {/* Error */}
        <Route path="*" element={<Error404 />} />
      </Routes>
      {/* </AnimatePresence> */}
    </BrowserRouter>
  );
};
