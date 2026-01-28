import { CreateReservationDto } from '@app/common';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateReservationDto extends PartialType(CreateReservationDto) { }
