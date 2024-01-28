export type LoginMutationResponse = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type LoginData = {
  password: string;
  email: string;
};

export type Register = LoginData & {
  name: string;
};

export type Error = {
  status: number;
  error: string;
};
