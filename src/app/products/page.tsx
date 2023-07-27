"use client";
import { Card, Row, Col, Image, Select } from "antd";
import { use, useState } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
interface ProductFilters {
  rating: number | null;
  price: number | null;
  brand: string;
}
async function getProductData() {
  const result = await fetch("https://dummyjson.com/products", {
    cache: "no-store",
  }).then((res) => res.json());

  return result;
}
const dataPromise = getProductData();
export default function Products() {
  const [filters, setFilters] = useState<ProductFilters>({
    rating: null,
    price: null,
    brand: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const productsData = use(dataPromise);
  const ratingSelectData = Array.from(
    new Set(productsData.products.map((product: Product) => product.rating))
  );
  const priceSelectData = Array.from(
    new Set(productsData.products.map((product: Product) => product.price))
  );

  const brandSelectData = Array.from(
    new Set(productsData.products.map((product: Product) => product.brand))
  );

  const orders = [
    { value: "title", label: "title" },
    { value: "rating", label: "rating" },
    { value: "price", label: "price" },
  ];
  const generateSelectOptions = (data) =>
    data?.map((row: string | number) => ({ label: row, value: row }));

  const handleFilterChange = (param: string, value: number | string) =>
    setFilters((prev) => ({ ...prev, [param]: value }));

  const filterAndOrderProducts = (filters: ProductFilters) => {
    const filteredData = productsData.products.filter((product: Product) => {
      const priceMatch =
        !filters?.price ||
        (product.price >= filters?.price && product.price <= filters?.price);

      const brandMatch =
        !filters?.brand ||
        product.brand.toLowerCase() === filters?.brand.toLowerCase();

      const ratingMatch =
        !filters.rating ||
        (product.rating >= filters.rating && product.rating <= filters.rating);

      return priceMatch && brandMatch && ratingMatch;
    });

    switch (orderBy) {
      case "title":
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "price":
        filteredData.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        filteredData.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filteredData;
  };

  return (
    <>
      <Row style={{ marginBlock: 30 }} justify={"center"} align={"middle"}>
        <Col span={2}>Filters for Products:</Col>
        <Col span={2}>
          <Select
            placeholder="Choose Rating"
            style={{ width: 150 }}
            options={generateSelectOptions(ratingSelectData)}
            onChange={(value) => handleFilterChange("rating", value)}
            allowClear
          />
        </Col>
        <Col span={2}>
          <Select
            placeholder="Choose Price"
            style={{ width: 150 }}
            options={generateSelectOptions(priceSelectData)}
            onChange={(value) => handleFilterChange("price", value)}
            allowClear
          />
        </Col>
        <Col span={2}>
          <Select
            placeholder="Choose Brand"
            style={{ width: 150 }}
            options={generateSelectOptions(brandSelectData)}
            onChange={(value) => handleFilterChange("brand", value)}
            allowClear
          />
        </Col>
        <Col span={2}>
          <Select
            placeholder="Choose Order"
            style={{ width: 150 }}
            options={orders}
            onChange={setOrderBy}
            allowClear
          />
        </Col>
      </Row>
      <Row gutter={[10, 10]}>
        {filterAndOrderProducts(filters)?.map((product: Product) => (
          <Col span={4}>
            <Card style={{ height: 400 }}>
              <Image src={product.thumbnail} height={250} />
              <h2>Product Title : {product.title}</h2>
              <h3>Product Price: {product.price}</h3>
              <h3>Product Rating: {product.rating}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
