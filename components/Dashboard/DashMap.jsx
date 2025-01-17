import React, { useState, useRef } from 'react';
import PageHeader from "@/components/General/PageHeader";
import { Box, Paper, TextField, Button, Typography, Card, CardContent, CardMedia, Grid, IconButton, Divider, CircularProgress } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Dialog from '@/components/General/Dialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import { FaSearchLocation } from "react-icons/fa";

const containerStyle = {
  width: '100%',
  height: '800px',
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

const DashMap = () => {
  const [map, setMap] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [placePhotos, setPlacePhotos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handleSearch = () => {
    if (!map) {
      console.error('Map instance is not loaded yet.');
      return;
    }

    setIsLoading(true);

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      query: searchValue,
      fields: ['name', 'geometry', 'place_id'],
    };

    try {
      service.findPlaceFromQuery(request, (results, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const place = results[0];
          setSelectedLocation(place.geometry.location);
          map.panTo(place.geometry.location);

          fetchPlaceDetails(place.place_id, place.geometry.location);
        } else {
          console.error('Place not found or error:', status);
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.error('Error during search:', error);
    }
  };

  const fetchPlaceDetails = (placeId, location) => {
    const service = new window.google.maps.places.PlacesService(map);
    const detailsRequest = {
      placeId,
      fields: [
        'name', 'formatted_address', 'photos', 'rating', 'website', 'formatted_phone_number',
        'address_components', 'business_status', 'opening_hours', 'price_level', 'reviews', 'types', 'url'
      ],
    };

    service.getDetails(detailsRequest, (placeResult, placeStatus) => {
      if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaceDetails(placeResult);
        setPlacePhotos(placeResult.photos || []);
        fetchNearbyPlaces(location);
      } else {
        console.error('Place details not found or error:', placeStatus);
      }
    });
  };

  const fetchNearbyPlaces = (location) => {
    if (!map) {
      console.error('Map instance is not loaded yet.');
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);
    const nearbyRequest = {
      location,
      radius: 2000,
      type: ['lodging', 'tourist_attraction', 'restaurant'],
    };

    try {
      service.nearbySearch(nearbyRequest, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setNearbyPlaces(results);
        } else {
          console.error('Error fetching nearby places:', status);
        }
      });
    } catch (error) {
      console.error('Error during nearby search:', error);
    }
  };

  const handleMapClick = (event) => {
    const location = event.latLng;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location,
      radius: 50,
      query: '',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const place = results[0];
        setSelectedLocation(location);
        fetchPlaceDetails(place.place_id, location);
      } else {
        console.error('No places found at the clicked location:', status);
      }
    });
  };

  const handleViewClick = (place) => {
    setSelectedPlace(place);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedPlace(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <PageHeader routeName="G-MAPS Activity Finder" />
      <Paper style={{ fontFamily: 'Roboto', padding: '20px', margin: '20px', boxShadow: '1px 2px 3px rgba(0, 0, 0, 0.5)' }}>
      <Box display="flex" alignItems="center" mb={2}>
          <TextField
            label="Search Location"
            variant="outlined"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ marginRight: '10px' }}
            InputProps={{
              style: {
                height: '40px',
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#550000',
                },
                '&:hover fieldset': {
                  borderColor: '#ff0000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#550000',
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSearch}
            startIcon={isLoading ? <CircularProgress size={24} /> : <FaSearchLocation sx={{ color: '#550000' }} />}
            disabled={isLoading}
            sx={{
              height: '40px',
              backgroundColor: 'white',
              border: '1px solid #550000',
              color: '#550000',
              '&:hover': {
                backgroundColor: 'white',
                border: '1px solid #ff0000',
                color: '#ff0000',
              },
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              libraries={['places']}
              onError={() => {
                console.error('Error loading Google Maps API script. Please check your API key or network connection.');
              }}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onLoad={onLoad}
                onClick={handleMapClick}
              >
                {selectedLocation && (
                  <Marker
                    position={{
                      lat: selectedLocation.lat(),
                      lng: selectedLocation.lng(),
                    }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ height: '800px', overflowY: 'auto' }}>
              {nearbyPlaces.length > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '2px solid #550000',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    <Typography variant="h6">Nearby Places</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {nearbyPlaces.map((place, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={
                              place.photos && place.photos[0]
                                ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 140 })
                                : 'https://via.placeholder.com/200x140'
                            }
                            alt={`Place photo ${index + 1}`}
                          />
                          <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6">{place.name}</Typography>
                            {/* {place.rating && (
                              <Typography variant="body2">Rating: {place.rating}</Typography>
                            )}
                            {place.vicinity && (
                              <Typography variant="body2">{place.vicinity}</Typography>
                            )} */}
                          </CardContent>
                          <Tooltip title="View Details">
                            <IconButton 
                              onClick={() => handleViewClick(place)} 
                              sx={{ 
                                '&:hover': { backgroundColor: 'transparent' },
                                '&:active': { backgroundColor: 'transparent' }
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {selectedPlace && (
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth title={selectedPlace.name}>
          {selectedPlace.photos && selectedPlace.photos.length > 0 && (
            <img
              src={selectedPlace.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 })}
              alt={selectedPlace.name}
              style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
            />
          )}
          
          {selectedPlace.rating && (
            <Typography variant="body2">Rating: {selectedPlace.rating}</Typography>
          )}
          {selectedPlace.vicinity && (
            <Typography variant="body2">{selectedPlace.vicinity}</Typography>
          )}
          {selectedPlace.formatted_address && (
            <Typography variant="body2">{selectedPlace.formatted_address}</Typography>
          )}
          {selectedPlace.formatted_phone_number && (
            <Typography variant="body2">Phone: {selectedPlace.formatted_phone_number}</Typography>
          )}
          {selectedPlace.website && (
            <Typography variant="body2">
              Website: <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">{selectedPlace.website}</a>
            </Typography>
          )}
          {selectedPlace.business_status && (
            <Typography variant="body2">Business Status: {selectedPlace.business_status}</Typography>
          )}
          {selectedPlace.opening_hours && selectedPlace.opening_hours.weekday_text && (
            <Box>
              <Typography variant="body2">Opening Hours:</Typography>
              {selectedPlace.opening_hours.weekday_text.map((day, index) => (
                <Typography key={index} variant="body2">{day}</Typography>
              ))}
            </Box>
          )}
          {selectedPlace.price_level !== undefined && (
            <Typography variant="body2">Price Level: {selectedPlace.price_level}</Typography>
          )}
          {selectedPlace.reviews && selectedPlace.reviews.length > 0 && (
            <Box>
              <Typography variant="body2">Reviews:</Typography>
              {selectedPlace.reviews.map((review, index) => (
                <Box key={index} sx={{ marginBottom: '10px' }}>
                  <Typography variant="body2"><strong>{review.author_name}</strong> ({review.rating}): {review.text}</Typography>
                </Box>
              ))}
            </Box>
          )}
          {selectedPlace.types && (
            <Typography variant="body2">Types: {selectedPlace.types.join(', ')}</Typography>
          )}
          {selectedPlace.url && (
            <Typography variant="body2">
              Google Maps URL: <a href={selectedPlace.url} target="_blank" rel="noopener noreferrer">{selectedPlace.url}</a>
            </Typography>
          )}
        </Dialog>
      )}
    </Box>
  );
};

export default DashMap;
