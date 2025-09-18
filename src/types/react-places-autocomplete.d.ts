declare module "react-places-autocomplete" {
  export function geocodeByAddress(address: string): Promise<any[]>;
  export function getLatLng(result: any): Promise<{ lat: number; lng: number }>;
}
