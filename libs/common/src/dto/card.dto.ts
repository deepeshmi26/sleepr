import { IsCreditCard, IsNumber, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CardDto {
    @IsCreditCard()
    number: string;

    @IsNumber()
    exp_month: number;

    @IsNumber()
    exp_year: number;

    @IsString()
    @IsNotEmpty()
    cvc: string;
}