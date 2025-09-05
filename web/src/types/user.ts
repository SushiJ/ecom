type User = {
	_id: string;
	name: string;
	email: string;
	role: string;
}

export type LoginMutationResponse = User

export type GetUsersResponse = {
	message: string;
	users: Array<LoginMutationResponse>;
};


export type GetUsersByIdResponse = {
	message: string;
	user: User
}

export type UpdateUserInfoMutation = Omit<LoginMutationResponse, "_id"> & {
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
