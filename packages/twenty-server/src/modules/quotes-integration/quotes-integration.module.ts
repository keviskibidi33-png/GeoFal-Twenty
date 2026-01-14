import { Module } from '@nestjs/common';

import { QuotesIntegrationController } from 'src/modules/quotes-integration/controllers/quotes-integration.controller';

@Module({
  controllers: [QuotesIntegrationController],
})
export class QuotesIntegrationModule {}
