import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

type QuotesHandoffIntent = 'view' | 'edit' | 'new';

type QuotesHandoffRequestBody = {
  quoteId?: string;
  companyId?: string;
  personId?: string;
  intent?: QuotesHandoffIntent;
};

type QuotesHandoffResponseBody = {
  handoffToken: string;
  redirectUrl: string;
  expiresIn: number;
};

@Controller('api/integrations/quotes')
@UseGuards(JwtAuthGuard, WorkspaceAuthGuard, NoPermissionGuard)
export class QuotesIntegrationController {
  @Post('handoff')
  async createHandoff(
    @Body() _body: QuotesHandoffRequestBody,
    @AuthWorkspace() _workspace: WorkspaceEntity,
    @AuthUser() _user: UserEntity,
  ): Promise<QuotesHandoffResponseBody> {
    return {
      handoffToken: 'stub',
      redirectUrl: 'https://quotes.example.com/sso/consume',
      expiresIn: 90,
    };
  }
}
