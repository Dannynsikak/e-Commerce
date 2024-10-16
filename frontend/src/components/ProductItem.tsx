import { Button, Card, Col } from "react-bootstrap";
import { Product } from "../types/Product";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, calculatePrices } from "../slices/CartSlice";
import { AppDispatch, RootState } from "../store";
import { CartItem } from "../types/Cart";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";
import AdminDashboard from "./Admin";

export default function ProductItem({ product }: { product: Product }) {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleAddItem = (item: CartItem) => {
    dispatch(addItemToCart(item));
    dispatch(calculatePrices()); // Recalculate prices after adding item
    toast.success("Item added to cart!"); // Toast for success
  };

  const isAdmin =
    userInfo &&
    userInfo.length > 0 &&
    userInfo.some((user) => user.role === "admin");
  return (
    <>
      <Card className="shadow-sm">
        <Link to={`/product/${product.slug}`}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ height: "200px", objectFit: "cover" }} // Maintain image aspect ratio
          />
        </Link>
        <Card.Body>
          <Link
            to={`/product/${product.slug}`}
            className="text-decoration-none"
          >
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

      {/* Render the AdminDashboard if the user is an admin */}

      {isAdmin && (
        <div>
          <AdminDashboard />
        </div>
      )}
    </>
  );
}
