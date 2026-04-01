import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Finance, FinanceDocument } from './schema/finance.schema';
import { CreateFinanceInput } from './dto/create-finance.input';
import { UpdateFinanceInput } from './dto/update-finance.input';
import { FilterFinanceInput } from './dto/filter-finance.input';
import { PaginationInput } from './dto/pagination.input';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Finance.name) private financeModel: Model<FinanceDocument>,
  ) {}

  async create(
    userId: string,
    createFinanceInput: CreateFinanceInput,
  ): Promise<Finance> {
    try {
      const finance = new this.financeModel({
        userId: new Types.ObjectId(userId),
        ...createFinanceInput,
      });
      return await finance.save();
    } catch (error) {
      throw new BadRequestException('Failed to create financial record');
    }
  }

  async findById(id: string, userId: string): Promise<Finance> {
    try {
      const finance = await this.financeModel.findById(
        new Types.ObjectId(id),
      );

      if (!finance) {
        throw new NotFoundException('Financial record not found');
      }

      // Check ownership unless user is admin (will be checked at resolver level)
      if (finance.userId.toString() !== userId) {
        throw new UnauthorizedException(
          'Not authorized to access this record',
        );
      }

      return finance;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Invalid record ID format');
    }
  }

  async findAll(
    userId: string,
    filterInput?: FilterFinanceInput,
    paginationInput?: PaginationInput,
  ): Promise<{ items: Finance[]; total: number }> {
    const skip = paginationInput?.skip || 0;
    const take = paginationInput?.take || 10;

    // Build filter query
    const query: any = { userId: new Types.ObjectId(userId) };

    if (filterInput) {
      if (filterInput.type) {
        query.type = filterInput.type;
      }
      if (filterInput.category) {
        query.category = filterInput.category;
      }
      if (filterInput.dateFrom || filterInput.dateTo) {
        query.date = {};
        if (filterInput.dateFrom) {
          query.date.$gte = new Date(filterInput.dateFrom);
        }
        if (filterInput.dateTo) {
          query.date.$lte = new Date(filterInput.dateTo);
        }
      }
    }

    const total = await this.financeModel.countDocuments(query);
    const items = await this.financeModel
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(take);

    return { items, total };
  }

  async update(
    id: string,
    userId: string,
    updateFinanceInput: UpdateFinanceInput,
  ): Promise<Finance> {
    try {
      // First verify ownership
      const finance = await this.financeModel.findById(
        new Types.ObjectId(id),
      );

      if (!finance) {
        throw new NotFoundException('Financial record not found');
      }

      if (finance.userId.toString() !== userId) {
        throw new UnauthorizedException(
          'Not authorized to update this record',
        );
      }

      const updated = await this.financeModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        {
          ...updateFinanceInput,
          updatedAt: new Date(),
        },
        { new: true },
      );

      if (!updated) {
        throw new BadRequestException('Failed to update financial record');
      }

      return updated;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update financial record');
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const finance = await this.financeModel.findById(
        new Types.ObjectId(id),
      );

      if (!finance) {
        throw new NotFoundException('Financial record not found');
      }

      if (finance.userId.toString() !== userId) {
        throw new UnauthorizedException(
          'Not authorized to delete this record',
        );
      }

      await this.financeModel.findByIdAndDelete(new Types.ObjectId(id));
      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete financial record');
    }
  }

  async findAllByUserId(userId: string): Promise<Finance[]> {
    return this.financeModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 });
  }

  async findAllByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Finance[]> {
    return this.financeModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 });
  }
}
