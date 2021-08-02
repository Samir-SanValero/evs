import {Injectable} from '@angular/core';

@Injectable()
export class Logger {
  log(msg: any): any   { console.log(msg); }
  error(msg: any): any { console.error(msg); }
  warn(msg: any): any  { console.warn(msg); }
}
