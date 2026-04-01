import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Finance, FinanceDocument, FinanceType } from './schema/finance.schema';
import {
  DashboardSummary,
  CategoryTotal,
} from './dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Finance.name) private financeModel: Model<FinanceDocument>,
  ) {}

  async getDashboardSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DashboardSummary> {
    const userObjectId = new Types.ObjectId(userId);

    // Set default date range to current month
    let periodStart = startDate;
    let periodEnd = endDate;

    if (!periodStart || !periodEnd) {
      const now = new Date();
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    const matchStage = {
      $match: {
        userId: userObjectId,
        date: { $gte: periodStart, $lte: periodEnd },
      },
    };

    // Get income and expense totals using aggregation
    const totalsAgg = await this.financeModel.aggregate([
      matchStage,
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totalsAgg.forEach((item) => {
      if (item._id === FinanceType.INCOME) {
        totalIncome = item.total;
      } else if (item._id === FinanceType.EXPENSE) {
        totalExpense = item.total;
      }
    });

    // Get category-wise totals
    const categoryData = await this.financeModel.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    const categoryWiseTotals: CategoryTotal[] = categoryData.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
    }));

    // Get recent activity
    const recentActivity = await this.financeModel
      .find({
        userId: userObjectId,
      })
      .sort({ date: -1 })
      .limit(10);

    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      categoryWiseTotals,
      recentActivity,
      periodStart,
      periodEnd,
    };
  }

  async getTotalIncome(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const userObjectId = new Types.ObjectId(userId);

    let query: any = {
      userId: userObjectId,
      type: FinanceType.INCOME,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const result = await this.financeModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalExpense(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const userObjectId = new Types.ObjectId(userId);

    let query: any = {
      userId: userObjectId,
      type: FinanceType.EXPENSE,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const result = await this.financeModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getNetBalance(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const income = await this.getTotalIncome(userId, startDate, endDate);
    const expense = await this.getTotalExpense(userId, startDate, endDate);
    return income - expense;
  }

  async getCategoryWiseTotals(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CategoryTotal[]> {
    const userObjectId = new Types.ObjectId(userId);

    let matchQuery: any = { userId: userObjectId };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = startDate;
      if (endDate) matchQuery.date.$lte = endDate;
    }

    const result = await this.financeModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    return result.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
    }));
  }

  async getRecentActivity(userId: string, limit: number = 10): Promise<Finance[]> {
    return this.financeModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);
  }
}
