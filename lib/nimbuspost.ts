/**
 * Compatibility Layer: NimbusPost -> Shiprocket
 * Re-exports Shiprocket types and methods to ensure full backward compatibility.
 */

import {
  ShiprocketCourierOption,
  ShiprocketShipmentResult,
  getShiprocketServiceability,
  createShiprocketShipment,
} from "./shiprocket";

export type NimbusCourierOption = ShiprocketCourierOption;
export type NimbusShipmentResult = ShiprocketShipmentResult;

export async function getNimbusServiceability(
  deliveryPincode: string,
  weightKg: number = 1.0,
  cod: boolean = false
) {
  return getShiprocketServiceability(deliveryPincode, weightKg, cod);
}

export async function createNimbusShipment(order: any) {
  return createShiprocketShipment(order);
}
