import React, { useRef, useEffect, useState, memo } from 'react';
import mapboxgl, { Marker, Map } from 'mapbox-gl';
import { Map_Box_Access_Token } from '../../../Config/credentials';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from 'sonner';
import adminAxiosInstance from '../../../Config/AxiosInstance/adminInstance';

mapboxgl.accessToken = Map_Box_Access_Token;

const BookingsMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(6);
  const [bookingLocations, setBookingLocations] = useState([]);

  const addMarkers = () => {
    if (!map.current) return;
    bookingLocations.forEach((booking) => {
      if (booking?.coordinates) {
        new Marker({ color: '#341919' })
          .setLngLat([booking?.coordinates[0], booking?.coordinates[1]])
          .addTo(map.current);
      }
    });
  };

  useEffect(() => {
    if (!map.current) {
      map.current = new Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [76.2711, 10.8505],
        zoom: zoom,
      });

      map.current.on('move', () => {
        setZoom(map.current.getZoom());
      });
    }
  }, [zoom]);

  useEffect(() => {
    (async () => {
      try {
        const response = await adminAxiosInstance.get(`/fetchbookingsLocation`);
        setBookingLocations(response.data);
        addMarkers();
      } catch (error) {
        if (error.response?.status === 401) {
          setAdminIsLogged(false);
          navigate('/login', { state: { message: 'Authorization failed, please login' } });
        } else {
          toast.error("Can't find booking history, please wait for a moment.");
        }
      }
    })();
  }, []);

  useEffect(() => {
    addMarkers();
  }, [bookingLocations]);

  return (
    <div className="col-lg-8 mb-3">
      <div className="card min-height-400 p-3">
        <h6 className='m-2 mb-3'>Booking locations</h6>
        <div ref={mapContainer} className="map-container height-400 w-100 rounded-3" />
      </div>
    </div>
  );
};

export default memo(BookingsMap);