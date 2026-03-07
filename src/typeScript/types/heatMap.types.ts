export interface CrimePoint {
  lat: number;
  lng: number;
  severity: number;
  type: string;
  date: string;
}

export interface DensityPoint {
  lat: number;
  lng: number;
  weight: number;
}