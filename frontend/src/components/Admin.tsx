import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchUsers, deleteUser, addUser } from "../slices/userSlice";
import { Button, ListGroup, Row, Col, Form } from "react-bootstrap";

const AdminDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      await dispatch(fetchUsers());
    };

    fetchUserData();
  }, [dispatch]); // Ensure no unnecessary re-renders occur

  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const role = form.elements.namedItem("role") as HTMLSelectElement;

    dispatch(
      addUser({ name: name.value, email: email.value, role: role.value })
    );
    form.reset(); // Reset the form after submission
  };

  return (
    <>
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      <h2 className="mb-3">Manage Users</h2>

      <Row>
        <Col md={6}>
          <ListGroup>
            {userInfo && userInfo.length > 0 ? (
              userInfo.map((user) => (
                <ListGroup.Item
                  key={user._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.name}</strong> - {user.role}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete User
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No users found</ListGroup.Item>
            )}
          </ListGroup>
        </Col>

        <Col md={6}>
          <h3>Add New User</h3>
          <Form onSubmit={handleAddUser}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" required>
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="user">User</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
