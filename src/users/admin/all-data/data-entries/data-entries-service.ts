// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { DataEntryResponse } from './data-entries.schema';
// import { CreateDataEntryResponseDto } from './data-entries.dto';

// @Injectable()
// export class DataEntryResponsesService {
//   constructor(
//     @InjectModel(DataEntryResponse.name)
//     private responseModel: Model<DataEntryResponse>,
//   ) {}

//   async submitResponse(dto: CreateDataEntryResponseDto, enumeratorId: string) {
//     return this.responseModel.create({
//       ...dto,
//       enumerator: enumeratorId,
//     });
//   }

//   async getEnumeratorResponses(enumeratorId: string) {
//     return this.responseModel.find({ enumerator: enumeratorId });
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SurveyResponse, ResponseDocument } from './data-entries.schema';
import { SubmitSurveyDto } from './data-entries.dto';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectModel(SurveyResponse.name)
    private responseModel: Model<ResponseDocument>,
  ) {}

  async submitSurvey(dto: SubmitSurveyDto): Promise<SurveyResponse> {
    const newResponse = new this.responseModel(dto);
    return newResponse.save();
  }
}
