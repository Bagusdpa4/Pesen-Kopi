import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import { Homepage } from "../pages/Homepage";
import { Error404 } from "../pages/errors/Error404";
import { Minuman } from "../pages/product/Minuman";
// import { Makanan } from "../pages/product/Makanan";
import { Categories } from "../pages/categories/Categories";
import { Selected } from "../pages/product/Selected";
import { OrderSatuan } from "../pages/order/OrderSatuan";
import { OrderBundling } from "../pages/order/OrderBundling";
import { Bundling } from "../pages/product/Bundling";

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
        {/* <Route path="/makanan" element={<Makanan />} /> */}

        {/* Product: pilih mode (satuan/bundling) */}
        <Route path="/:categoryId/:brandId" element={<Selected />} />
        <Route path="/:categoryId/:brandId/bundling" element={<Bundling />} />

        {/* Product: form pesan per brand + mode */}
        <Route path="/:categoryId/:brandId/satuan" element={<OrderSatuan />} />
        <Route
          path="/:categoryId/:brandId/bundling/:bundleId"
          element={<OrderBundling />}
        />

        {/* Error */}
        <Route path="*" element={<Error404 />} />
      </Routes>
      {/* </AnimatePresence> */}
    </BrowserRouter>
  );
};
