import { useEffect, useState } from "react";
import type { Coordinates } from "@/api/type";

interface GeolocationState {
    coordinates: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export function useGeolocation(){
    const [locationData, setLocationData] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading: true,
    });
    const gatLocation = () => {
        setLocationData((prev) => ({...prev, isLoading: true, error:null }));
        if(!navigator.geolocation){
            setLocationData({
                coordinates:null,
                error: "Geolocation not supported",
                isLoading: false,
            });
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            setLocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false,
            });
        },
        (err) => {
            let errorMessage: string;
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorMessage = "Location Permission Denied";
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable";
                    break;
                case err.TIMEOUT:
                    errorMessage = "The request to get user location timed out";
                    break;
                default:
                    errorMessage = "An unknown error occurred";
            }
            setLocationData({
                coordinates: null,
                error: errorMessage,
                isLoading: false,
            });
        }, {
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0,
        });
         
    };
    useEffect(() => {
        gatLocation();
    }, []);

    return { ...locationData, gatLocation };
}