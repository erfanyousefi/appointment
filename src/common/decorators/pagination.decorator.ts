import {applyDecorators} from "@nestjs/common";
import {ApiQuery} from "@nestjs/swagger";

export const Pagination = () =>
  applyDecorators(
    ApiQuery({name: "page", type: Number, required: false, example: 0}),
    ApiQuery({name: "limit", type: Number, required: false, example: 10})
  );
