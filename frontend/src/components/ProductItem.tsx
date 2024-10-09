import { Button, Card } from "react-bootstrap";
import { Product } from "../types/Product";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch } from "react-redux";
import { addItemToCart, calculatePrices } from "../slices/CartSlice";
import { AppDispatch } from "../store";
import { CartItem } from "../types/Cart";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";

export default function ProductItem({ product }: { product: Product }) {
  const dispatch: AppDispatch = useDispatch();
  // const cart = useSelector((state: RootState) => state.cart);

  const handleAddItem = (item: CartItem) => {
    dispatch(addItemToCart(item));
    dispatch(calculatePrices()); // Recalculate prices after adding item
    toast.success("Item added to cart!"); // Toast for success
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddItem(convertProductToCartItem(product))}
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
