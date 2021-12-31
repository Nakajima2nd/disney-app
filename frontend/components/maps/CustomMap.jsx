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

export const CustomMap = ({ searchResult, current }) => {
  const [iconPath, setIconPath] = useState()
  const [currentPaths, setCurrentPaths] = useState(
    searchResult.subroutes[current].coords.map(latlng => ({
      lat: Number(latlng[0]),
      lng: Number(latlng[1])
    }))
  )
  const [currentMarkers, setCurrentMarkers] = useState(
    searchResult.spots.flatMap((spot, index) => (
      index === current || index === current + 1
        ? {
          position: {
            lat: Number(spot.lat),
            lng: Number(spot.lon)
          },
          label: {
            text: index === current ? 'S' : 'G',
            color: '#fff'
          },
          icon: {
            scale: 4,
            fillColor: index === current ? '#5956FF' : '#FF56E4',
            fillOpacity: 1,
            strokeColor: index === current ? '#5956FF' : '#FF56E4',
            strokeOpacity: 1,
            strokeWeight: 16
          },
          zIndex: 2
        }
        : []
    ))
  )

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
      scale: 2,
      fillColor: '#2B99FF',
      fillOpacity: 0.4,
      strokeColor: '#2B99FF',
      strokeOpacity: 0.4,
      strokeWeight: 16
    },
    zIndex: 1
  }))

  const paths = searchResult.subroutes.reduce((acc, { coords }) => {
    return acc.concat(coords.map(latlng => ({
      lat: Number(latlng[0]),
      lng: Number(latlng[1])
    })))
  }, [])

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

  const onLoad = () => {
    setIconPath(window.google.maps.SymbolPath.CIRCLE)
  }

  useEffect(() => {
    setCurrentPaths(
      searchResult.subroutes[current].coords.map(latlng => ({
        lat: Number(latlng[0]),
        lng: Number(latlng[1])
      }))
    )
    setCurrentMarkers(
      searchResult.spots.flatMap((spot, index) => (
        index === current || index === current + 1
          ? {
            position: {
              lat: Number(spot.lat),
              lng: Number(spot.lon)
            },
            label: {
              text: index === current ? 'S' : 'G',
              color: '#fff'
            },
            icon: {
              scale: 4,
              fillColor: index === current ? '#5956FF' : '#FF56E4',
              fillOpacity: 1,
              strokeColor: index === current ? '#5956FF' : '#FF56E4',
              strokeOpacity: 1,
              strokeWeight: 16
            },
            zIndex: 2
          }
          : []
      ))
    )
  }, [current])

  return (
    <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        clickableIcons={false}
        id={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        // heading={390}
        options={{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID,
          mapTypeControl: false,
          zoomControl: false,
          fullscreenControl: false,
          rotateControl: false,
          // heading: 90
        }}
      >
        {/* マーカー */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            icon={{
              ...marker.icon,
              path: iconPath
            }}
            position={marker.position}
            label={marker.label}
            zIndex={marker.zIndex}
          />
        ))}
        {/* スタートとゴールのマーカー */}
        {currentMarkers.map((marker, index) => (
          <Marker
            key={index}
            icon={{
              ...marker.icon,
              path: iconPath
            }}
            position={marker.position}
            label={marker.label}
            zIndex={marker.zIndex}
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