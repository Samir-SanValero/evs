import {AuthenticationService} from './authentication.service';

export function appInitializer(authenticationService: AuthenticationService): any {
  console.log('Initializing EVS');

  return () => new Promise(resolve => {
    // attempt to refresh token on app start up to auto authenticate
    try {
      authenticationService.refreshToken().subscribe().add(resolve);
    } catch (e) { }
  });
}
