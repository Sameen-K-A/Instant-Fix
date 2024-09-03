import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Marker, Map } from 'mapbox-gl';
import axios from 'axios';
import { Map_Box_Access_Token } from '../../config/credentials'; 
import { LocationSymbolForMap } from '../../../public/svgs/Icons';
import { MapDirectionURL } from '../../config/credentials'; 
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = Map_Box_Access_Token;

const ServiceLocationMap = ({ currentLocation, destination }) => {
   const mapContainer = useRef(null);
   const map = useRef(null);
   const [zoom, setZoom] = useState(12);
   const [distance, setDistance] = useState(null);

   useEffect(() => {
      if (map.current) return;

      map.current = new Map({
         container: mapContainer.current,
         style: 'mapbox://styles/mapbox/satellite-streets-v12',
         center: [currentLocation.longitude, currentLocation.latitude],
         zoom: zoom,
      });

      new Marker({ color: 'blue' })
         .setLngLat([currentLocation.longitude, currentLocation.latitude])
         .addTo(map.current);

      new Marker({ color: 'red' })
         .setLngLat([destination.longitude, destination.latitude])
         .addTo(map.current);

      const fetchDirection = async () => {
         const query = `${MapDirectionURL}/${currentLocation.longitude},${currentLocation.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${Map_Box_Access_Token}`;

         try {
            const response = await axios.get(query);
            const route = response.data.routes[0].geometry.coordinates;
            const routeDistance = response.data.routes[0].distance / 1000;
            setDistance(routeDistance.toFixed(2));

            map.current.addSource('route', {
               'type': 'geojson',
               'data': {
                  'type': 'Feature',
                  'geometry': {
                     'type': 'LineString',
                     'coordinates': route
                  }
               }
            });

            map.current.addLayer({
               'id': 'route',
               'type': 'line',
               'source': 'route',
               'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
               },
               'paint': {
                  'line-color': '#0000FF',
                  'line-width': 4
               }
            });
         } catch (error) {
            console.error('Error fetching directions:', error);
         }
      };

      map.current.on('load', fetchDirection);
      map.current.on('move', () => {
         setZoom(map.current.getZoom());
      });
   }, [currentLocation, destination, zoom]);

   return (
      <>
         <div ref={mapContainer} className="map-container height-500 w-100 rounded-3 " />
         <p className='text-sm m-0 mb-1 mt-5 text-bold'> Note: <span className='font-bold text-danger'>The location shown here is an estimate and may not be the exact location. However, the difference should not be significant.</span></p>
         {distance && (
            <p className='text-sm m-0 mb-1'>Estimated distance between locations: {distance} KM</p>
         )}
         <p className='text-sm m-0 mb-1'><span className='text-blue-500 font-bold'><LocationSymbolForMap color={"#0000FF"} /></span> Your current location</p>
         <p className='text-sm m-0 mb-1'><span className='text-red-500 font-bold'><LocationSymbolForMap color={"#ff0000"} /></span> Client location</p>
      </>
   );
};

export default ServiceLocationMap;