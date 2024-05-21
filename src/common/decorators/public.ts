import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// this is a custom decorator that will be used to mark routes as public
// if you want to define a route as public, you can use this decorator
// this will set a metadata for this function and when the AuthGuard is called
// it will check if the route is public or not
export const IsPublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);

// note for myself:
// The decorator runs at the time the class is defined, not at runtime.
