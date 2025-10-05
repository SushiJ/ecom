import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import {
	useDeleteUserMutation,
	useGetUsersQuery,
} from "../../features/user/slice";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const UsersList = () => {
	const { data, refetch, isLoading, error } = useGetUsersQuery();

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

	function isAdmin(role: string) {
		return role === "admin";
	}
	function isUser(role: string) {
		return role === "user";
	}

	if (!data) {
		return <h1>Empty</h1>;
	}

	return (
		<>
			<h1 className="text-sm italic text-center my-8">Users</h1>
			{isLoading ? (
				<Loader />
			) : error ? (
				<pre>{JSON.stringify(error, null, 2)}</pre>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-center">ID</TableHead>
							<TableHead className="text-center">NAME</TableHead>
							<TableHead className="text-center">EMAIL</TableHead>
							<TableHead className="">ROLE</TableHead>
							<TableHead className="text-center">ACTION</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.users.map(({ user }) => (
							<TableRow key={user._id}>
								<TableCell>{user._id}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</TableCell>
								<TableCell>
									{isAdmin(user.role) ? (
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
								</TableCell>
								<TableCell>
									{isUser(user.role) && (
										<div className="space-y-2 lg:space-y-0 lg:space-x-2">
											<Link to={`/admin/user/${user._id}/edit`}>
												<Button size="sm" variant="outline">
													<Icon
														icon="material-symbols:person-edit"
														style={{ color: "darkgreen" }}
														width="24"
														height="24"
													/>
												</Button>
											</Link>
											<Button
												size="sm"
												variant="outline"
												onClick={() => deleteHandler(user._id)}
											>
												<Icon
													icon="material-symbols:person-cancel"
													style={{ color: "#d9534f" }}
													width="24"
													height="24"
												/>
											</Button>
										</div>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};

export default UsersList;
