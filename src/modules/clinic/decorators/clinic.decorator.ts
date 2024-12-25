import {applyDecorators, UseGuards} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";
import {ClinicGuard} from "src/modules/auth/guards/clinic.guard";

export function ClinicAuth() {
  return applyDecorators(
    ApiBearerAuth("Authorization"),
    UseGuards(ClinicGuard)
  );
}
