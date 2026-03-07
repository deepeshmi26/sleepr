import { CreateReservationDto, PAYMENTS_SERVICE, User } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { catchError, map } from 'rxjs';
import { Reservation } from './models/reservation.entity';
@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository, @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy) { }
  async create(createReservationDto: CreateReservationDto, { email, id: userId }: User) {
    return this.paymentsService.send('create-charge', { ...createReservationDto.charge, email }).pipe(map((res) => {
      const reservation = new Reservation({ ...createReservationDto, timestamp: new Date(), userId: userId, invoiceId: res.id });
      return this.reservationsRepository.create(reservation);
    }),
      catchError((err) => {
        throw new Error(err.message);
      })
    );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: number) {
    return this.reservationsRepository.findOne({ id: _id });
  }

  async update(_id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate({ id: _id }, updateReservationDto);
  }

  async remove(_id: number) {
    return this.reservationsRepository.findOneAndDelete({ id: _id });
  }
}
