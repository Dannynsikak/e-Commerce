import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetailsBySlug,
  selectError,
  selectLoading,
  selectProductDetails,
} from "../slices/productSlice";
import { useEffect } from "react";
import { AppDispatch } from "../store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useParams } from "react-router-dom";
import { Row, Col, ListGroup, Card, Badge, Button } from "react-bootstrap";
import Rating from "../components/Rating";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const productDetails = useSelector(selectProductDetails);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (slug) {
      console.log("Fetching product with slug:", slug);
      dispatch(fetchProductDetailsBySlug(slug));
    } else {
      console.error("Slug is undefined.");
    }
  }, [dispatch, slug]);

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : !productDetails ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            src={productDetails.image}
            alt={productDetails.name}
            className="large"
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{productDetails.name}</title>
              </Helmet>
              <h1>{productDetails.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={productDetails.rating}
                numReviews={productDetails.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${productDetails.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: <p>{productDetails.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            {" "}
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${productDetails.price}</Col>
                  </Row>
                </ListGroup.Item>{" "}
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {productDetails.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {productDetails.countInStock > 0 && (
                  <ListGroup.Item>
                    {" "}
                    <div className="d-grid">
                      <Button variant="primary">Add to Cart</Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Add more product details here */}
    </div>
  );
}
