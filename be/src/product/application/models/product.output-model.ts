/**
 * Product output model - simple data object for application layer.
 * Independent from domain entities.
 * Matches frontend IProduct interface.
 */
export type EnergyClass = "A" | "B" | "C";

export type Capacity = 8 | 9 | 10.5;

export type Features =
  | "Drzwi AddWash™"
  | "Panel AI Control"
  | "Silnik inwerterowy"
  | "Wyświetlacz elektroniczny";

export interface ProductOutputModel {
  image: string;
  code: string;
  name: string;
  color: string;
  capacity: Capacity;
  dimensions: string;
  features: Features[];
  energyClass: EnergyClass;
  price: {
    value: number;
    currency: string;
    installment: {
      value: number;
      period: number;
    };
    validFrom: Date;
    validTo: Date;
  };
}
