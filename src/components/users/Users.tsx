import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form } from "react-bootstrap";

import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";

import { RootState } from "../../store";
import { editUser, decryptData } from "../../store/userSlice";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  lastName: Yup.string().required("Last name is required."),
  email: Yup.string().email("Invalid email format").required("Email is required."),
  image: Yup.mixed().required("Image is required."),
});

const Users: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const [decryptedUser, setDecryptedUser] = useState<{
    name: string;
    lastName: string;
    email: string;
    image: string;
  } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      const userInfo = {
        name: decryptData(user.name),
        lastName: decryptData(user.lastName),
        email: decryptData(user.email),
        image: decryptData(user.image),
      };

      setDecryptedUser(userInfo);
    }
  }, [user]);

  if (!decryptedUser) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    let imageUrl = decryptedUser.image;
    if (imageFile) {
      // Simulamos la subida del archivo al servidor y obtenemos la URL
      imageUrl = URL.createObjectURL(imageFile);
    }

    const valuesToEncrypt = {
      name: values.name,
      lastName: values.lastName,
      email: values.email,
      image: imageUrl,
    };
    dispatch(editUser(valuesToEncrypt));
    setSubmitting(false);
    navigate("/products");
  };

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card className="mb-4" style={{ width: "700px" }}>
        <Card.Header as="h5">Edit Profile</Card.Header>
        <Card.Body>
          <Formik
            initialValues={{
              name: decryptedUser.name,
              lastName: decryptedUser.lastName,
              email: decryptedUser.email,
              image: decryptedUser.image,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting, isValid, dirty }) => (
              <FormikForm>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Field type="text" name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Field type="text" name="lastName" className="form-control" />
                  <ErrorMessage name="lastName" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="formImage">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(event) => {
                      const input = event.currentTarget as HTMLInputElement;
                      const file = input.files ? input.files[0] : null;
                      setFieldValue("image", file);
                      setImageFile(file);
                    }}
                  />

                  <ErrorMessage name="image" component="div" className="text-danger" />
                </Form.Group>

                {decryptedUser.image && (
                  <img
                    src={decryptedUser.image}
                    alt="Profile Preview"
                    className="img-thumbnail mt-2"
                    style={{ maxWidth: "300px", height: "300px" }}
                  />
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  Save Changes
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Users;
