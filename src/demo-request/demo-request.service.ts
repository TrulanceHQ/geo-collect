import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DemoRequest } from './demo-request.schema';
import { CreateDemoRequestDto } from './demo-request.dto';
import { EmailUtil } from 'src/utils/email/email-util.service';

@Injectable()
export class DemoRequestsService {
  constructor(
    @InjectModel(DemoRequest.name)
    private demoRequestModel: Model<DemoRequest>,
    private emailUtil: EmailUtil,
  ) {}

  async create(dto: CreateDemoRequestDto) {
    const created = await this.demoRequestModel.create(dto);

    try {
      await this.emailUtil.sendEmail(
        dto.email,
        'Your Demo Request Received',
        'demo-request-confirmation',
        {
          fullName: dto.fullName,
        },
      );
    } catch (err) {
      console.error('Failed sending demo‐request email', err);
    }

    return created;
  }
  findAll() {
    return this.demoRequestModel.find().exec();
  }

  findOne(id: string) {
    return this.demoRequestModel.findById(id).exec();
  }

  delete(id: string) {
    return this.demoRequestModel.findByIdAndDelete(id).exec();
  }
}
