import { Hotel } from "@prisma/client";

export class AllHotelsDto {
  hotels: Hotel[];
  total: number;
}