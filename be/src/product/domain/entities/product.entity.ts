/**
 * Energy class type for product classification.
 */
export type EnergyClass = "A" | "B" | "C";

/**
 * Product capacity type.
 */
export type Capacity = 8 | 9 | 10.5;

/**
 * Product features type.
 */
export type Features =
  | "Drzwi AddWash™"
  | "Panel AI Control"
  | "Silnik inwerterowy"
  | "Wyświetlacz elektroniczny";

/**
 * Product price installment information.
 */
export interface IProductInstallment {
  value: number;
  period: number;
}

/**
 * Product price information.
 */
export interface IProductPrice {
  value: number;
  currency: string;
  installment: IProductInstallment;
  validFrom: Date;
  validTo: Date;
}

/**
 * Base product data interface - core product properties without metadata.
 * Used as foundation for other product types.
 */
export interface IProductData {
  image: string;
  code: string;
  name: string;
  color: string;
  capacity: Capacity;
  dimensions: string;
  features: Features[];
  energyClass: EnergyClass;
  price: IProductPrice;
}

/**
 * Product entity - domain model.
 */
export class ProductEntity {
  public readonly id?: string;
  public readonly image: string;
  public readonly code: string;
  public readonly name: string;
  public readonly color: string;
  public readonly capacity: Capacity;
  public readonly dimensions: string;
  public readonly features: Features[];
  public readonly energyClass: EnergyClass;
  public readonly price: IProductPrice;

  constructor(data: IProductData & { id?: string }) {
    this.id = data.id;
    this.image = data.image;
    this.code = data.code;
    this.name = data.name;
    this.color = data.color;
    this.capacity = data.capacity;
    this.dimensions = data.dimensions;
    this.features = data.features;
    this.energyClass = data.energyClass;
    this.price = data.price;
  }
}
