import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Button, Alert } from "react-bootstrap";

import { RootState } from "../../store";

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const location = useLocation();

  const productId = id ? parseInt(id) : null;
  const product = useSelector((state: RootState) => state.products.products.find((p) => p.id === productId));

  const handleCancel = () => {
    navigate(location.state?.from || "/products");
  };

  if (!product) {
    return <Alert variant="danger">Product not found</Alert>;
  }

  return (
    <Container className="mt-4 d-flex justify-content-center">
      {product && (
        <Card className="mb-4" style={{ width: "700px" }}>
          <Card.Header as="h5"> {product.title}</Card.Header>
          <Card.Body>
            <div className="d-flex flex-column">
              <div className="d-flex mb-3">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.title}
                  style={{ maxWidth: "300px", height: "auto", maxHeight: "300px", marginRight: "20px" }}
                />
                <div className="d-flex justify-content-evenly flex-column">
                  <Card.Title>
                    {product.category} - ${product.price}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{product.description}</Card.Subtitle>
                </div>
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/products/${product.id}?mode=edit`)}
                  className="mt-3"
                >
                  Edit
                </Button>
                <Button variant="secondary" onClick={handleCancel} className="mt-3 ms-2">
                  Cancel
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ProductEdit;
