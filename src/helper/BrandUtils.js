import categories from "../components/assets/assets-data/categories.json";

export function getBrand(categoryId, brandId) {
  const category = categories.find((c) => c.id === categoryId);
  const brand = category?.brands.find((b) => b.id === brandId);
  return { category, brand };
}

// modes sekarang selalu object — kembalikan array key-nya
export function getModeKeys(brand) {
  if (!brand?.modes) return [];
  return Object.keys(brand.modes); // ["satuan"] atau ["satuan", "bundling"]
}
