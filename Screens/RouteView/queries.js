export const listRoutesBySchoolID = /* GraphQL */ `
query getSchool($id: ID!) {
  getSchool(id: $id) {
    id
    schoolName
    Routes {
      items {
        routeName
        id
        isActive
        _version
        _deleted
      }
    }
  }
}
`;