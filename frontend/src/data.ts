import { Product } from "./types/Product";

export const sampleProducts: Product[] = [
  {
    name: "Nike Slim shirt",
    slug: "nike-slim-shirt",
    image: "../imgs/p1.jpg",
    category: "Shirts",
    brand: "Nike",
    price: 120,
    countInStock: 10,
    description: "high quality shirt",
    rating: 4.5,
    numReviews: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Adidas Fit shirt",
    slug: "adidas-fit-shirt",
    image: "../imgs/p2.jpg",
    category: "Shirts",
    brand: "Adidas",
    price: 100,
    countInStock: 20,
    description: "high quality product",
    rating: 4.0,
    numReviews: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Lacoste Free Pants",
    slug: "lacoste-free-pants",
    image: "../imgs/p3.jpg",
    category: "Pants",
    brand: "Lacoste",
    price: 220,
    countInStock: 0,
    description: "high quality product",
    rating: 4.8,
    numReviews: 17,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Nike Slim Pant",
    slug: "nike-slim-pant",
    image: "../imgs/p4.jpg",
    category: "Pants",
    brand: "Nike",
    price: 78,
    countInStock: 15,
    description: "high quality product",
    rating: 4.5,
    numReviews: 14,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
