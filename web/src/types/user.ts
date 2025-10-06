type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
};

export interface LoginMutationResponse extends GetUsersByIdResponse {}

export type GetUsersResponse = {
	message: string;
	users: Array<User>;
};

export type GetUsersByIdResponse = {
	message: string;
	user: User;
};

export type UpdateUserInfoMutation = Omit<User, "_id"> & {
	id: string;
};

export type LoginData = {
	password: string;
	email: string;
};

export type Register = LoginData & {
	name: string;
};
export type UserWithReview = Register;

export type Error = {
	status: number;
	error: string;
};
