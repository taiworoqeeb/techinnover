import { SetMetadata } from '@nestjs/common';
import { accountRole } from './role.enum';

export const Roles = (...role: accountRole[]) => SetMetadata('role', role);
