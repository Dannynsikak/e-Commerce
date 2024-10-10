declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      token: string;
    };
  }
}
