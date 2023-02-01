import { NotImplementedException } from '@nestjs/common';

export function TODO<T>(..._args: any[]): T {
  throw new NotImplementedException();
}
