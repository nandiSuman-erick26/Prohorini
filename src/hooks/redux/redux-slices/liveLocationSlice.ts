interface LiveLocationState  {
  isSharing: boolean
  is_Sos_active:boolean
  lat:number | null
  lng:number | null
  accuracy:number | null
  lastUpdate:string | null
  trackingMode: "idle"|"foreground"|"background"
}

const initialState :LiveLocationState = {
  isSharing:false,
  is_Sos_active:false,
  lat:null,
  lng:null,
  accuracy:null,
  lastUpdate:null,
  trackingMode:"idle"
}