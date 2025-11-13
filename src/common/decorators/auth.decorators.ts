import { applyDecorators, UseGuards } from "@nestjs/common"
import { Roles } from "./roles.decorator"
import { AuthGuard, RolesGuard } from "@common/guards"

export const Auth = (roles: string[]) => {
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthGuard, RolesGuard)
    )
}