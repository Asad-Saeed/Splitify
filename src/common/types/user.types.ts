export type JwtPayloadType = {
  sub: string;
  email: string;
  role: string;
};

export type RequestUser = {
  userId: string;
  email: string;
  role: string;
};
