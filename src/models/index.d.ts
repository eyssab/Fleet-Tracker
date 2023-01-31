import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerSchool = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<School, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly schoolName?: string | null;
  readonly Routes?: (Route | null)[] | null;
  readonly schoolPassword?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySchool = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<School, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly schoolName?: string | null;
  readonly Routes: AsyncCollection<Route>;
  readonly schoolPassword?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type School = LazyLoading extends LazyLoadingDisabled ? EagerSchool : LazySchool

export declare const School: (new (init: ModelInit<School>) => School) & {
  copyOf(source: School, mutator: (draft: MutableModel<School>) => MutableModel<School> | void): School;
}

type EagerRoute = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Route, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly routeName: string;
  readonly schoolID: string;
  readonly Stops?: (Stop | null)[] | null;
  readonly busLatitude?: number | null;
  readonly busLongitude?: number | null;
  readonly isActive?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoute = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Route, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly routeName: string;
  readonly schoolID: string;
  readonly Stops: AsyncCollection<Stop>;
  readonly busLatitude?: number | null;
  readonly busLongitude?: number | null;
  readonly isActive?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Route = LazyLoading extends LazyLoadingDisabled ? EagerRoute : LazyRoute

export declare const Route: (new (init: ModelInit<Route>) => Route) & {
  copyOf(source: Route, mutator: (draft: MutableModel<Route>) => MutableModel<Route> | void): Route;
}

type EagerStop = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Stop, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly stopName: string;
  readonly routeID: string;
  readonly isPassed?: boolean | null;
  readonly priorityNumber?: number | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStop = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Stop, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly stopName: string;
  readonly routeID: string;
  readonly isPassed?: boolean | null;
  readonly priorityNumber?: number | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Stop = LazyLoading extends LazyLoadingDisabled ? EagerStop : LazyStop

export declare const Stop: (new (init: ModelInit<Stop>) => Stop) & {
  copyOf(source: Stop, mutator: (draft: MutableModel<Stop>) => MutableModel<Stop> | void): Stop;
}

type EagerStudent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Student, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly verifiedSchoolID?: string | null;
  readonly isAdmin?: boolean | null;
  readonly isDriver?: boolean | null;
  readonly driverRouteID?: string | null;
  readonly subbedStop?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStudent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Student, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly verifiedSchoolID?: string | null;
  readonly isAdmin?: boolean | null;
  readonly isDriver?: boolean | null;
  readonly driverRouteID?: string | null;
  readonly subbedStop?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Student = LazyLoading extends LazyLoadingDisabled ? EagerStudent : LazyStudent

export declare const Student: (new (init: ModelInit<Student>) => Student) & {
  copyOf(source: Student, mutator: (draft: MutableModel<Student>) => MutableModel<Student> | void): Student;
}