import {ApiProperty} from "@nestjs/swagger";

export class RejectDto {
    @ApiProperty({})
    reason: string
}