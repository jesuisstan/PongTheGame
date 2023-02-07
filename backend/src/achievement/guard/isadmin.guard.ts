import { Role } from ".prisma/client";
import { UseGuards } from "@nestjs/common";
import { applyDecorators } from '@nestjs/common';
import { IsAuthenticatedGuard } from '../../auth/auth.guard';
import { RolesGuard } from "./roles.guard";

export function IsAdmin(...roles: Role[]) {
  return applyDecorators(
    UseGuards(IsAuthenticatedGuard, RolesGuard),
  );
};

