import { Module } from '@nestjs/common';

import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { FavoriteFolderModule } from 'src/modules/favorite-folder/favorite-folder.module';
import { FavoriteModule } from 'src/modules/favorite/favorite.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { QuotesIntegrationModule } from 'src/modules/quotes-integration/quotes-integration.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';

@Module({
  imports: [
    MessagingModule,
    CalendarModule,
    ConnectedAccountModule,
    WorkflowModule,
    FavoriteFolderModule,
    FavoriteModule,
    QuotesIntegrationModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
