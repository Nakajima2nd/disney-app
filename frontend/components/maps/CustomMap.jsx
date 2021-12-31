import { GoogleMap, LoadScriptNext, Marker, Polyline, useGoogleMap } from '@react-google-maps/api'
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%'
}

const AAA = ({ lat, lng }) => {
  const map = useGoogleMap()

  useEffect(() => {
    map.setMapTypeId('satellite')
    map.panTo(new window.google.maps.LatLng(lat, lng))
  }, [map, lat, lng])
  return null
}

export const CustomMap = ({ searchResult, current }) => {
  const [iconPath, setIconPath] = useState()
  const [center, setCenter] = useState({
    lat: (Number(searchResult.spots[current].lat) + Number(searchResult.spots[current + 1].lat)) / 2,
    lng: (Number(searchResult.spots[current].lon) + Number(searchResult.spots[current + 1].lon)) / 2,
  })
  console.log(searchResult)
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
      fontSize: '12px',
      color: '#fff',
      className: 'marker-label'
    },
    icon: {
      scale: 2,
      fillColor: '#2B99FF',
      fillOpacity: 1,
      strokeColor: '#2B99FF',
      strokeOpacity: 1,
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
    strokeOpacity: 1,
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
        mapTypeId="satellite"
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
        <AAA lat={(Number(searchResult.spots[current].lat) + Number(searchResult.spots[current + 1].lat)) / 2} lng={(Number(searchResult.spots[current].lon) + Number(searchResult.spots[current + 1].lon)) / 2} />
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