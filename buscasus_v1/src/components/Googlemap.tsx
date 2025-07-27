"use client";
import { useEffect, useRef, useState } from "react";
import "./Googlemap.css";
interface GoogleMapProps {
    destination: {
        place_id: string;
        name: string;
        formatted_address: string;
    } | null;
    onRouteCleared: () => void;
    showMessage: (message: string) => void;
    onAddressConfirmed?: (city: string, place_id: string) => void;
}
declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}
export default function GoogleMap({ destination, onRouteCleared, showMessage, onAddressConfirmed }: GoogleMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);
    const [map, setMap] = useState<any>(null);
    const [directionsService, setDirectionsService] = useState<any>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocationMarker, setUserLocationMarker] = useState<any>(null);
    const [destinationMarker, setDestinationMarker] = useState<any>(null);
    const [showDirections, setShowDirections] = useState(false);
    const [autocomplete, setAutocomplete] = useState<any>(null);
    const [addressConfirmed, setAddressConfirmed] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    useEffect(() => {
        const checkIfMapsLoaded = () => {
            if (window.google && window.google.maps) {
                initializeMap();
                return true;
            }
            return false;
        };
        const initializeMap = () => {
            if (!mapRef.current) return;
            const directionsServiceInstance = new window.google.maps.DirectionsService();
            const directionsRendererInstance = new window.google.maps.DirectionsRenderer();
            setDirectionsService(directionsServiceInstance);
            setDirectionsRenderer(directionsRendererInstance);
            const defaultCenter = { lat: -2.53073, lng: -44.3068 };
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                zoom: 13,
                center: defaultCenter,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
            });
            directionsRendererInstance.setMap(mapInstance);
            setMap(mapInstance);
            setMapLoaded(true);
        };
        if (!checkIfMapsLoaded()) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEuKHaxqYCj78yw90FXkwsE3a_ITRqfpA&libraries=places,geometry&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = () => {
                showMessage("Erro ao carregar o Google Maps. Por favor, recarregue a página.");
            };
            window.initMap = () => {
                if (!checkIfMapsLoaded()) {
                    showMessage("O Google Maps não carregou corretamente.");
                }
            };
            document.head.appendChild(script);
        }
        return () => {
            if (window.google && map) {
                window.google.maps.event.clearInstanceListeners(map);
            }
        };
    }, []);
    useEffect(() => {
        if (window.google && addressInputRef.current && !autocomplete && map) {
            const autocompleteInstance = new window.google.maps.places.Autocomplete(addressInputRef.current, {
                types: ["address"],
                componentRestrictions: { country: "BR" },
                fields: ["place_id", "geometry", "name", "formatted_address", "address_components"],
            });
            autocompleteInstance.addListener("place_changed", () => {
                const place = autocompleteInstance.getPlace();
                if (place.geometry && place.geometry.location) {
                    setSelectedPlace(place);
                }
            });
            setAutocomplete(autocompleteInstance);
        }
    }, [map, autocomplete]);
    useEffect(() => {
        if (destination && directionsService && directionsRenderer && map && userLocation && addressConfirmed) {
            calculateAndDisplayRoute();
        }
    }, [destination, directionsService, directionsRenderer, map, userLocation, addressConfirmed]);
    const calculateAndDisplayRoute = () => {
        if (!userLocation || !destination?.place_id || !directionsService || !directionsRenderer) {
            showMessage("❌ Por favor, primeiro digite seu endereço válido");
            return;
        }
        if (destinationMarker) {
            destinationMarker.setMap(null);
        }
        const request = {
            origin: userLocation,
            destination: { placeId: destination.place_id },
            travelMode: window.google.maps.TravelMode.DRIVING,
        };
        directionsService
            .route(request)
            .then((response: any) => {
                directionsRenderer.setDirections(response);
                setShowDirections(true);
                const marker = new window.google.maps.Marker({
                    position: response.routes[0].legs[0].end_location,
                    map,
                    title: destination.name,
                    icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40),
                    },
                });
                setDestinationMarker(marker);
            })
            .catch((e: any) => {
                console.error("Erro ao calcular rota:", e);
                showMessage("❌ Erro ao calcular rota. Verifique seu endereço e tente novamente.");
            });
    };
    const clearRoute = () => {
        if (directionsRenderer) {
            directionsRenderer.set("directions", null);
        }
        if (destinationMarker) {
            destinationMarker.setMap(null);
            setDestinationMarker(null);
        }
        setShowDirections(false);
        onRouteCleared();
        if (map && userLocation) {
            map.setCenter(userLocation);
            map.setZoom(16);
        }
        setAddressConfirmed(false);
    };
    const handleCancelAddress = () => {
        if (addressInputRef.current) {
            addressInputRef.current.value = "";
        }
        setSelectedPlace(null);
    };
    const handleConfirmAddress = () => {
        if (!selectedPlace) {
            showMessage("Por favor, selecione um endereço válido da lista de sugestões.");
            return;
        }
        const newLocation = {
            lat: selectedPlace.geometry.location.lat(),
            lng: selectedPlace.geometry.location.lng(),
        };
        setUserLocation(newLocation);
        setAddressConfirmed(true);
        let city = "";
        for (const component of selectedPlace.address_components) {
            if (component.types.includes("administrative_area_level_2")) {
                city = component.long_name;
                break;
            }
        }
        if (onAddressConfirmed) {
            onAddressConfirmed(city, selectedPlace.place_id);
        }
        if (map) {
            map.setCenter(newLocation);
            map.setZoom(16);
            if (userLocationMarker) {
                userLocationMarker.setMap(null);
            }
            const marker = new window.google.maps.Marker({
                position: newLocation,
                map: map,
                title: "Seu Endereço",
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                },
            });
            setUserLocationMarker(marker);
        }
    };
    return (
        <div className="container-mapa">
            {!mapLoaded && (
                <div className="map-loading">
                </div>
            )}
            <div className="status-localizacao">
                <div className="conteudo-status">
                    <p className="texto-status">
                    </p>
                    {userLocation && (
                        <p className="detalhes-localizacao" style={{ display: 'none' }}>
                            📍 Coordenadas: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                        </p>
                    )}
                </div>
            </div>
            {!addressConfirmed && (
                <>
                    <div className="modal-overlay"></div>
                    <div className="modal-endereco obrigatorio">
                        <div className="conteudo-modal">
                            <h3 className="titulo-modal">📍 Digite seu Endereço Completo</h3>
                            <p className="texto-modal">
                                Por favor, digite seu endereço completo para continuar:
                            </p>
                            <input
                                ref={addressInputRef}
                                type="text"
                                placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade"
                                className="campo-endereco"
                                required />
                            <p className="texto-ajuda">Digite até ver sugestões de endereços e selecione o correto</p>
                            <div className="botoes-modal">
                                <button className="botao-cancelar" onClick={handleCancelAddress}>Cancelar</button>
                                <button className="botao-confirmar" onClick={handleConfirmAddress}>Confirmar Endereço</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div
                ref={mapRef}
                className={`map-view ${mapLoaded ? 'visible' : 'hidden'}`}
                style={{ height: '100%', width: '100%' }} />
            {addressConfirmed && (
                <div className="container-botoes">
                    <button
                        onClick={clearRoute}
                        className="botao-limpar">
                        🔄 Nova Busca no Mapa
                    </button>
                </div>
            )}
        </div>
    );
}