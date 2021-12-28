import { GoogleMap, LoadScriptNext, Marker, Polyline } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '800px'
};

const center = {
  lat: 35.626630558175975,
  lng: 139.88994325030163
};

export const CustomMap = ({ searchResult }) => {

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
    label: spot.shortSpotName
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
  return (
    <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        clickableIcons={false}
        id="15c2beb9dbd319e9"
        options={{ mapId: '8f8f4d61dd1b3627' }}
      >
        {/* マーカー */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            // icon={{
            //   path: google.maps.SymbolPath.CIRCLE,
            //   scale: 7,
            // }}
            position={marker.position}
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