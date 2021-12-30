import { GoogleMap, LoadScriptNext, Marker, Polyline } from '@react-google-maps/api'
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 35.625745295180174,
  lng: 139.8844380917959
};

export const CustomMap = ({ searchResult }) => {
  const [path, setPath] = useState()

  console.log(searchResult)

  const paths = searchResult.subroutes.reduce((acc, { coords }) => {
    return acc.concat(coords.map(latlng => ({
      lat: Number(latlng[0]),
      lng: Number(latlng[1])
    })))
  }, [])

  const currentPaths = searchResult.subroutes[0].coords.map(latlng => ({
    lat: Number(latlng[0]),
    lng: Number(latlng[1])
  }))

  const markers = searchResult.spots.map(spot => ({
    position: {
      lat: Number(spot.lat),
      lng: Number(spot.lon)
    },
    label: {
      text: spot.shortSpotName,
      color: '#5c5c5c'
    },
    icon: {
      // path: window.google.maps.SymbolPath.CIRCLE,
      scale: 2,
      fillColor: '#2B99FF',
      fillOpacity: 0.4,
      strokeColor: '#2B99FF',
      strokeOpacity: 0.4,
      strokeWeight: 16
    }
  }))

  const options = {
    strokeColor: '#c0c0c0',
    strokeOpacity: 0.8,
    strokeWeight: 4,
    fillColor: '#c0c0c0',
    fillOpacity: 0.3,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths,
    zIndex: 1
  }

  const currentOptions = {
    ...options,
    strokeWeight: 8,
    strokeColor: '#FFC224',
    fillColor: '#FFC224',
    paths: currentPaths,
    zIndex: 2
  }

  console.log(markers)

  const onLoad = () => {
    setPath(window.google.maps.SymbolPath.CIRCLE)
  }

  return (
    <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        clickableIcons={false}
        id="15c2beb9dbd319e9"
        heading={390}
        options={{
          mapId: '8f8f4d61dd1b3627',
          mapTypeControl: false,
          zoomControl: false,
          fullscreenControl: false,
          rotateControl: false
        }}
      >
        {/* マーカー */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            icon={{
              ...marker.icon,
              path: path
            }}
            position={marker.position}
            label={marker.label}
          />

        ))}
        {/* ルート全容 */}
        <Polyline
          options={options}
          path={paths}
        />
        {/* 現在の区間 */}
        <Polyline
          options={currentOptions}
          path={currentPaths}
        />
      </GoogleMap>
    </LoadScriptNext>
  )
}