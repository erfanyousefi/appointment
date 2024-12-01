import {applyDecorators} from "@nestjs/common";
import {ApiQuery} from "@nestjs/swagger";
import {ClinicStatus} from "../enum/status.enum";

export const ClinicFilter = () =>
  applyDecorators(
    ApiQuery({name: "search", type: String, required: false}),
    ApiQuery({
      name: "status",
      type: String,
      required: false,
      enum: ClinicStatus,
    }),
    ApiQuery({
      name: "from_date",
      type: String,
      required: false,
      description: "2024-10-01T17:28:22.663Z",
    }),
    ApiQuery({
      name: "to_date",
      type: String,
      required: false,
      description: "2024-12-01T17:28:22.663Z",
    })
  );
