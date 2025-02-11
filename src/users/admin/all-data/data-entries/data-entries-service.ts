import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DataEntry } from './data-entries.schema';
import { SubmitDataEntryDto } from './data-entires.dto';

@Injectable()
export class DataEntryService {
  constructor(
    @InjectModel(DataEntry.name)
    private readonly dataEntryModel: Model<DataEntry>,
  ) {}

  async createDataEntry(
    createDataEntryDto: SubmitDataEntryDto,
    enumeratorId: string,
  ) {
    const newEntry = new this.dataEntryModel({
      ...createDataEntryDto,
      enumerator: new Types.ObjectId(enumeratorId),
    });
    return await newEntry.save();
  }

  async getDataEntryById(id: string) {
    const entry = await this.dataEntryModel.findById(id).exec();
    if (!entry) {
      throw new NotFoundException(`Data entry with ID ${id} not found.`);
    }
    return entry;
  }
}
