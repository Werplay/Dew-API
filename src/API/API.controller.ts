import {
  Controller,
  Get,
  UploadedFile,
  Body,
  Query,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Post,
} from '@nestjs/common';
import { APIservice } from './API.service';
import { configService } from '../config/configuration';
import { ethers } from 'ethers';

const _ = require('lodash');

@Controller('')
export class APIcontroller {
  constructor(private readonly apiService: APIservice) {
    // this.test();
  }

  private async test() {
    for (let i = 0; i < 2; i++) {
      // await this.getBalance([]);
      console.log(await this.getCohorts());
      await this.apiService.delay(5);
    }
  }

  @Post('balance/:address?:limit?:page?:order?') async getBalance(
    @Query() query: any,
  ) {
    let res = { tr: 0, data: null };

    try {
      if (query.address != null)
        query.address = ethers.utils.getAddress(query.address);
    } catch (e) {
      console.error(e);
      throw new HttpException(`Invalid Address`, HttpStatus.BAD_REQUEST);
    }
    try {
      const limit = query.limit ? parseInt(query.limit) : 10;
      const page = query.page ? parseInt(query.page) : 0;
      const order = query.order ? query.order : 'desc';

      const temp = await this.apiService.getBalance(
        query.address,
        limit,
        page,
        order,
      );
      res['data'] = temp['res'];
      res['tr'] = temp['tr'];

      return res;
    } catch (e) {
      console.error(e);
      throw new HttpException(`Invalid Params`, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('cohorts') async getCohorts() {
    let res = { tr: 0, data: null };

    try {
      const temp = await this.apiService.getCohorts();
      res['data'] = temp['res'];
      res['tr'] = temp['tr'];

      return res;
    } catch (e) {
      console.error(e);
      throw new HttpException(`Invalid Params`, HttpStatus.BAD_REQUEST);
    }
  }
}
