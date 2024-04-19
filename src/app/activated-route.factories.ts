import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// this factory function will get value as an observable from route paramMap
// based on the param key you passed in
// if your current route is '/customers/:customerId' then you would call
// routeParamFactory('customerId')
export function routeParamFactory(
  paramKey: string,
): (route: ActivatedRoute) => Observable<string | null> {
  return (route: ActivatedRoute): Observable<string | null> => {
    return route.paramMap.pipe(map((param) => param.get(paramKey)));
  };
}

// this factory function will get value as a snapshot from route paramMap
// based on the param key you passed in
export function routeParamSnapshotFactory(
  paramKey: string,
): (route: ActivatedRoute) => string | null {
  return (route: ActivatedRoute): string | null => {
    return route.snapshot.paramMap.get(paramKey);
  };
}

// same as above factory, but get value from query param
// if your current route is 'customers?from=USA
// then you would call queryParamFactory('from')
export function queryParamFactory(
  paramKey: string,
): (route: ActivatedRoute) => Observable<string | null> {
  return (route: ActivatedRoute): Observable<string | null> => {
    return route.queryParamMap.pipe(map((param) => param.get(paramKey)));
  };
}

// same as queryParamFactory, but get snapshot, instead of observable
export function queryParamSnapshotFactory(
  paramKey: string,
): (route: ActivatedRoute) => string | null {
  return (route: ActivatedRoute): string | null => {
    return route.snapshot.queryParamMap.get(paramKey);
  };
}
