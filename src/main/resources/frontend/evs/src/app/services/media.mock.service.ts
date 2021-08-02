import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { EmbryoImage } from '../models/embryo-image.model';
import { VideoParams } from '../models/video-params-model';
import { catchError, retry } from 'rxjs/operators';
import { ImagesRequest } from '../models/images-request-model';
import { EmbryoInstant } from '../models/patient.model';
import { environment } from '../../environments/environment.prod';
import { createEmbryoImage, createEmbryoInstant } from './functions.mock';


@Injectable({
  providedIn: 'root'
})
export class MediaMockService {

  private pathToMedia = '/media';
  private pathToListImages = '/listImages';
  private pathToGetImage = '/getImages';
  private pathToRetrieveImage = '/retrieveImage';
  private pathToGenerateVideo = '/generateVideo';
  private pathToObtainEmbryoImages = '/listImagesFromEmbryo/{id}/zIndex/{zIndex}';
  private pathToListAvailableZIndex = "/media/listAvailableZIndex/";
  private pathToListAvailableInstants = "/media/listAvailableInstants/";
  /*private pathToListAvailableImagesFromEmbryo = '';
  private pathToListAvailableImagesFromEmbryoAndZIndex = '';*/
  private pathToListAvailableFullInstants = '/media/listAvailableInstants/';
  private pathToListEmbryoImagesFromEmbryo = '/media/listImagesFromEmbryo/';

  //private embryoImageSubscription: Subscription;
  private lastLoadedEmbryoImageSubject: BehaviorSubject<EmbryoImage> = new BehaviorSubject<EmbryoImage>(new EmbryoImage());

  private HTTPOptions = {
    headers: new HttpHeaders({
      'Accept':'video/mp4'
    }),
    'responseType': 'blob' as 'json'
  }

  constructor(private http: HttpClient) {
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  public getImages (data : ImagesRequest) : Observable<EmbryoImage[]> {
	var array : EmbryoImage[] = [];
	var em : EmbryoImage = createEmbryoImage(6);
  	array.push(em);
  	if (data.imagesIds.length > 0) {
  		return of (array);
  	}
	return null;
  }

  public generateVideo (data : VideoParams) : Observable<Blob>{
    return of (new Blob(["TEST"]));
  }

  public listAvailableZIndexes(embryoId): Observable<number> {
	  return of (5);
  }

  public listAvailableInstants(embryoId): Observable<Array<number>> {
	var array : Array<number> = new Array<number>();
	array.push(5);
	return of (array);
  }

  public listAvailableFullInstants(embryoId, zIndex): Observable<EmbryoInstant[]> {
	var array : EmbryoInstant[] = [];  
  	array.push(createEmbryoInstant(3));
  	return of (array);
  }

  public getListImagesFromEmbryo (embryoId : string, z : number) : Observable <Array<EmbryoImage>> {
	var array : Array<EmbryoImage> = new Array<EmbryoImage>();
  	array.push(createEmbryoImage(7));
  	return of (array);
  }

  public listEmbryoImagesFromEmbryo(embryoId): Observable<Array<EmbryoImage>> {
	var array : Array<EmbryoImage> = new Array<EmbryoImage>();
	array.push(createEmbryoImage(9));
	return of (array);
  }


  public getSelectedImageObservable(): Observable<EmbryoImage> {
    return of (createEmbryoImage(11));
  }


  public selectEmbryoImage(request: ImagesRequest): void {
  }


  public retrieveImage(imageRequest: ImagesRequest): Observable<EmbryoImage[]> {
    var array : EmbryoImage[] = [];
	var em : EmbryoImage = createEmbryoImage(6);
	array.push(em);
	return of (array);
  }
}

