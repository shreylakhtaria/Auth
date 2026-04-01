import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Finance, FinanceSchema } from './schema/finance.schema';
import { FinanceService } from './finance.service';
import { FinanceResolver } from './finance.resolver';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Finance.name, schema: FinanceSchema }]),
  ],
  providers: [FinanceService, FinanceResolver, DashboardService, DashboardResolver],
  exports: [FinanceService, MongooseModule],
})
export class FinanceModule {}
