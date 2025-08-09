import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
