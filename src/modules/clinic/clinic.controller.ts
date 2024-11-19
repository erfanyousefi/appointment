import {Body, Controller, Post} from "@nestjs/common";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {FormType} from "src/common/enum/formtype.enum";
import {ClinicService} from "./clinic.service";
import {CreateClinicDto} from "./dto/clinic.dto";

@Controller("clinic")
@ApiTags("Clinic")
export class ClinicController {
  constructor(private clinicService: ClinicService) {}
  @Post("register")
  @ApiConsumes(FormType.Multipart)
  register(@Body() dto: CreateClinicDto) {
    return this.clinicService.register(dto);
  }
}
