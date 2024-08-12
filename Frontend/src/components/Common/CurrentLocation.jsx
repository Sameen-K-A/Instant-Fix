import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const GetCurrentLocation = () => {
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);

  const getLocationDetailsByPincode = async () => {
    if (!pincode) {
      toast.error("Please enter a valid pincode.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&format=json&addressdetails=1`
      );

      if (response.data.length > 0) {
        console.log(response.data[0])
        const data = response.data[0];
        const { country, state, city, county } = data.address;

        setLocationDetails({
          country,
          state,
          city: city || county, // In some areas, city may not be available, so fallback to county
          pincode,
          latitude: data.lat,
          longitude: data.lon,
        });

        toast.success(`Location found: ${city || county}, ${state}, ${country}`);
      } else {
        toast.error("No location found for this pincode.");
      }

      setIsLoading(false);
    } catch (error) {
      toast.error("Error fetching location details.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        type="text"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Enter Pincode"
        className="pincode-input"
      />

      {isLoading ? (
        <button className="btn bg-gradient-primary" disabled>Loading...</button>
      ) : (
        <button className="btn bg-gradient-primary" onClick={getLocationDetailsByPincode}>
          Get Location
        </button>
      )}

      {locationDetails && (
        <div className="location-details">
          <p>Country: {locationDetails.country}</p>
          <p>State: {locationDetails.state}</p>
          <p>City: {locationDetails.city}</p>
          <p>Pincode: {locationDetails.pincode}</p>
          <p>Latitude: {locationDetails.latitude}</p>
          <p>Longitude: {locationDetails.longitude}</p>
        </div>
      )}
    </>
  );
};

export default GetCurrentLocation;