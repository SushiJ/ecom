export type LoginMutationResponse = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export interface GetUsersResponse extends LoginMutationResponse {}

export interface GetUsersByIdResponse extends LoginMutationResponse {}

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
