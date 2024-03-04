import { Table, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../features/user/slice";

import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

const UsersList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err);
      }
    }
  };

  if (!users) {
    return <>Empty</>;
  }

  return (
    <>
      <h1>Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <Icon
                      icon="eos-icons:admin"
                      style={{ color: "black" }}
                      width="24"
                      height="24"
                    />
                  ) : (
                    <Icon
                      icon="material-symbols:account-box"
                      style={{ color: "black" }}
                      width="24"
                      height="24"
                    />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="outline-light" className="btn-sm">
                          <Icon
                            icon="material-symbols:person-edit"
                            style={{ color: "darkgreen" }}
                            width="24"
                            height="24"
                          />
                        </Button>
                      </Link>
                      <Button
                        variant="outline-light"
                        className="btn-sm"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <Icon
                          icon="material-symbols:person-cancel"
                          style={{ color: "#d9534f" }}
                          width="24"
                          height="24"
                        />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UsersList;
