import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import withAuthPage from "../hoc/auth/withAuthPage";
import { useNavigator } from "../hooks/hooks";
import { useRouter } from "next/router";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const { email, password } = form;

  const dispatch = useDispatch();

  const router =  useRouter()

  const { authDetails, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (authDetails || isSuccess) {
      useNavigator(router, authDetails)
    }

    dispatch(reset());
  }, [isError, isSuccess, authDetails, message]);

  const onInputChange = (e) => {
    setForm((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const onLoginFormSubmitted = (e) => {
    e.preventDefault();

    const userData = { email, password };

    dispatch(login(userData));
  };

  return (
    <Container>
      <Row className="mx-auto">
        <Col lg={6} md={8} sm={10}className="mx-auto">
          <Card className="p-3">
            <Form onSubmit={onLoginFormSubmitted}>
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  onChange={onInputChange}
                  value={email}
                  name="email"
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  onChange={onInputChange}
                  value={password}
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default  withAuthPage(Login);
