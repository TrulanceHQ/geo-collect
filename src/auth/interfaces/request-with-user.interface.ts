import { Request } from 'express';
import { UserRole } from '../schema/user.schema';

export interface RequestWithUser extends Request {
  user: {
    role: UserRole;
  };
}
