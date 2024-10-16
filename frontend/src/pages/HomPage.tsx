// src/components/HomePage.tsx
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectLoading,
  selectError,
  selectProducts,
} from "../slices/productSlice";
import { AppDispatch, RootState } from "../store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet-async";
import AdminDashboard from "../components/Admin"; // Ensure you import AdminDashboard
import AddProductForm from "../components/AddProducts";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const products = useSelector(selectProducts);

  const isAdmin =
    userInfo &&
    userInfo.length > 0 &&
    userInfo.some((user) => user.role === "admin");

  const isSeller =
    userInfo &&
    userInfo.length > 0 &&
    userInfo.some((user) => user.role === "seller");
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>eCommerce-App</title>
      </Helmet>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Row>
          {products!.map((product) => (
            <Col key={product.slug} sm={6} md={4} lg={3}>
              <ProductItem product={product} /> {/* Pass productId */}
            </Col>
          ))}
        </Row>
      )}

      {/* Render the AdminDashboard if the user is an admin */}
      {isAdmin && <AdminDashboard />}

      {isSeller && <AddProductForm />}
    </>
  );
}
