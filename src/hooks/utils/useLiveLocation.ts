import { useEffect, useRef, useState } from "react";

export interface UserLiveLocation{
  lat:number;
  lng:number
}

export const useLiveLocation=()=>{
  const [location, setlocation] = useState<UserLiveLocation | null>(null)
  const watchRef = useRef<number | null>(null)
  useEffect(()=>{
    if(!("geolocation" in navigator)){
      console.error("Geolocation not supported")
      return
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (position)=>{
        setlocation({
          lat:position.coords.latitude,
          lng:position.coords.longitude
        })
      },
      (error)=>{
        console.error("Error getting location",error)
      },
      {
        enableHighAccuracy:true,
        timeout:10000,
        maximumAge:5000
      }
    )

    return()=>{
      if(watchRef.current !== null){
        navigator.geolocation.clearWatch(watchRef.current)
      }
    }
  },[])

  return location
}