export const listStopsByRouteID = /* GraphQL */ `
query getRoute($id: ID!) {
    getRoute(id: $id) {
      id
      routeName
      busLatitude
      busLongitude
      _version
      _deleted
      Stops {
        items {
          stopName
          _deleted
          id
          isPassed
          priorityNumber
          latitude
          longitude
        }
      }
    }
  }
`;