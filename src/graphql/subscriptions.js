/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSchool = /* GraphQL */ `
  subscription OnCreateSchool($filter: ModelSubscriptionSchoolFilterInput) {
    onCreateSchool(filter: $filter) {
      id
      schoolName
      Routes {
        nextToken
        startedAt
      }
      schoolPassword
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateSchool = /* GraphQL */ `
  subscription OnUpdateSchool($filter: ModelSubscriptionSchoolFilterInput) {
    onUpdateSchool(filter: $filter) {
      id
      schoolName
      Routes {
        nextToken
        startedAt
      }
      schoolPassword
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteSchool = /* GraphQL */ `
  subscription OnDeleteSchool($filter: ModelSubscriptionSchoolFilterInput) {
    onDeleteSchool(filter: $filter) {
      id
      schoolName
      Routes {
        nextToken
        startedAt
      }
      schoolPassword
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateStudent = /* GraphQL */ `
  subscription OnCreateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onCreateStudent(filter: $filter) {
      id
      email
      verifiedSchoolID
      isAdmin
      isDriver
      driverRouteID
      subbedStop
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateStudent = /* GraphQL */ `
  subscription OnUpdateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onUpdateStudent(filter: $filter) {
      id
      email
      verifiedSchoolID
      isAdmin
      isDriver
      driverRouteID
      subbedStop
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteStudent = /* GraphQL */ `
  subscription OnDeleteStudent($filter: ModelSubscriptionStudentFilterInput) {
    onDeleteStudent(filter: $filter) {
      id
      email
      verifiedSchoolID
      isAdmin
      isDriver
      driverRouteID
      subbedStop
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateRoute = /* GraphQL */ `
  subscription OnCreateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onCreateRoute(filter: $filter) {
      id
      routeName
      schoolID
      Stops {
        nextToken
        startedAt
      }
      busLatitude
      busLongitude
      isActive
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateRoute = /* GraphQL */ `
  subscription OnUpdateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onUpdateRoute(filter: $filter) {
      id
      routeName
      schoolID
      Stops {
        nextToken
        startedAt
      }
      busLatitude
      busLongitude
      isActive
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteRoute = /* GraphQL */ `
  subscription OnDeleteRoute($filter: ModelSubscriptionRouteFilterInput) {
    onDeleteRoute(filter: $filter) {
      id
      routeName
      schoolID
      Stops {
        nextToken
        startedAt
      }
      busLatitude
      busLongitude
      isActive
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateStop = /* GraphQL */ `
  subscription OnCreateStop($filter: ModelSubscriptionStopFilterInput) {
    onCreateStop(filter: $filter) {
      id
      stopName
      routeID
      isPassed
      priorityNumber
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateStop = /* GraphQL */ `
  subscription OnUpdateStop($filter: ModelSubscriptionStopFilterInput) {
    onUpdateStop(filter: $filter) {
      id
      stopName
      routeID
      isPassed
      priorityNumber
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteStop = /* GraphQL */ `
  subscription OnDeleteStop($filter: ModelSubscriptionStopFilterInput) {
    onDeleteStop(filter: $filter) {
      id
      stopName
      routeID
      isPassed
      priorityNumber
      latitude
      longitude
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
