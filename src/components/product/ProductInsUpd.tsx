import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";

import { RootState } from "../../store";
import { editProduct, addProduct } from "../../store/productSlice";
import { Product } from "../../types/product/Product";
import { ProductInsUpdProps } from "../../types/product/Product";

const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];
const defaultImage = "https://via.placeholder.com/300";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required."),
  price: Yup.number().positive("The price must be a positive number.").required("Price is required."),
  description: Yup.string().required("Description is required."),
  category: Yup.string().required("Category is required."),
});

const ProductInsUpd: React.FC<ProductInsUpdProps> = ({ edit = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const productId = id ? parseInt(id) : null;
  const products = useSelector((state: RootState) => state.products.products);
  const product = products.find((p) => p.id === productId);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || defaultImage);

  useEffect(() => {
    if (productId && !product) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
          const data: Product = await response.json();
          setImagePreview(data.image || defaultImage);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [productId, product]);

  const handleSubmit = async (values: any, { setErrors, setSubmitting }: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price.toString());
    formData.append("description", values.description);
    formData.append("category", values.category);
    if (image) formData.append("image", image);
    let id;
    try {
      let response;
      if (edit) {
        id = productId;
        response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        response = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      //la api no me actualiza el producto y me devuelve siempre id 21 al agregar por lo tanto simulare el comportamiento

      // const { id } = await response.json();

      // const productResponse = await fetch(`https://fakestoreapi.com/products`);
      // if (!productResponse.ok) {
      //   throw new Error("Failed to fetch product details");
      // }

      // const product: Product = await productResponse.json();
      //  const id = state.products.products.lenght;
      const productData: Product = {
        id: id || 0,
        title: values.title,
        price: values.price,
        description: values.description,
        category: values.category,
        image: imagePreview || product?.image || "",
      };

      if (edit) {
        dispatch(editProduct(productData));
      } else {
        dispatch(addProduct(productData));
      }

      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({ general: "There was an error saving the product. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    navigate(location.state?.from || "/products");
  };

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card className="mb-4" style={{ width: "700px" }}>
        <Card.Header as="h5">{edit ? "Edit Product" : "Add Product"}</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              title: product?.title || "",
              price: product?.price || "",
              description: product?.description || "",
              category: product?.category || "", //categories.map category == product category
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <FormikForm>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Field type="text" name="title" className="form-control" />
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Field type="number" name="price" className="form-control" />
                  <ErrorMessage name="price" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Field as="textarea" rows={3} name="description" className="form-control" />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Field as="select" name="category" className="form-control">
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formImage">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} disabled={edit} />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="img-thumbnail mt-2"
                      style={{ maxWidth: "300px", height: "300px" }}
                    />
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  {edit ? "Save Changes" : "Add Product"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="mt-3 ms-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductInsUpd;
