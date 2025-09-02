import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  balance: number;

  @IsString()
  @IsNotEmpty()
  type: string; // Pode ser melhorado para um Enum no futuro

  @IsString()
  @IsNotEmpty()
  userId: string;
}
