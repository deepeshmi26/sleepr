import { CreateReservationDto, PAYMENTS_SERVICE, UserDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { catchError, map } from 'rxjs';
@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository, @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy) { }
  async create(createReservationDto: CreateReservationDto, { email, _id: userId }: UserDto) {
    return this.paymentsService.send('create-charge', { ...createReservationDto.charge, email }).pipe(map((res) => {
      return this.reservationsRepository.create({ ...createReservationDto, timestamp: new Date(), userId: userId, invoiceId: res.id });
    }),
      catchError((err) => {
        throw new Error(err.message);
      })
    );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id: _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({ _id: _id }, { $set: updateReservationDto });
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id: _id });
  }
}
