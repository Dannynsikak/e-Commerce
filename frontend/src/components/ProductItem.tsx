import { Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, calculatePrices } from "../slices/CartSlice";
import { AppDispatch } from "../store";
import { CartItem } from "../types/Cart";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";
import {
  fetchProducts,
  selectError,
  selectLoading,
  selectProducts,
} from "../slices/productSlice";
import { useEffect } from "react";
// import { Product } from "../types/Product";

export default function ProductItem({ productId }: { productId: string }) {
  const dispatch: AppDispatch = useDispatch();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const product = products.find((p) => p._id === productId);

  const handleAddItem = (item: CartItem) => {
    dispatch(addItemToCart(item));
    dispatch(calculatePrices());
    toast.success("Item added to cart!");
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <Card className="shadow-sm">
      <Link to={`/product/${product.slug}`}>
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          className="img-fluid"
          style={{ height: "200px", maxWidth: "100%" }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`} className="text-decoration-none">
          <Card.Title className="text-primary">{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text className="fw-bold">${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddItem(convertProductToCartItem(product))}
            variant="success"
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
