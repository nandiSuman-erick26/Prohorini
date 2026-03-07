// export type Role = "user" | "admin" | "super_Admin";

export type AuthState = {
  user: any | null;
  role: string | null;
};

export type Pos = {
  lat: number;
  lng: number;
};

export type GeoResult = {
  display_name: string;
  lat: number;
  lon: number;
};

export type Props = {
  onSelect: (lat: number, lng: number, label: string) => void;
  onClear?: () => void;
};

export type NavbarProps = {
  onLocationPick: (pos: { lat: number; lng: number }) => void;
};

export type LiveMapProps = {
  target?: Pos | null;
};

export type MarkerMode = "user-marker" | "user-alert" | "search-pin";

export type SignUpInput = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ThreatInput = {
  name: string;
  severity?: number;
  type?: string;
};
export type CircleInput = {
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  relation?: string;
  priority_order?: number;
};

export type ThreatZoneDrawMapProps = {
  onCreate: (geo: any) => void;
  zones?: any[];
};
