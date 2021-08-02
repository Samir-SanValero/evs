import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { EmbryoImage } from '../models/embryo-image.model';
import { VideoParams } from '../models/video-params-model';
import { catchError, retry } from 'rxjs/operators';
import { ImagesRequest } from '../models/images-request-model';
import { EmbryoInstant } from '../models/patient.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

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

  // Error handling
  errorHandle(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  /*public listDirectory (path: string) : Observable<HttpResponse<string[]>> {
    let url = environment.apiUrl + this.pathToMedia + this.pathToListImages;
    return this.http.get<string[]>(url, {
        params: {
            folder: path
          },
        observe: 'response'
    });
  }*/

  public getImages (data : ImagesRequest) : Observable<EmbryoImage[]> {
    let url = environment.apiUrl + this.pathToMedia + this.pathToGetImage;

    if (data.imagesIds.length > 0) {
        let res = this.http.post(url, data) as Observable<EmbryoImage[]>
        return res;
    }
    return null;
  }

  public generateVideo (data : VideoParams) : Observable<Blob>{
    let url = environment.apiUrl + this.pathToMedia + this.pathToGenerateVideo;
    return this.http.post(url, data, this.HTTPOptions) as Observable<Blob>;
  }

  /**
   * Returns available vertical focal levels in photos of embryo
   * @param embryoId
   * @constructor
   */
  public listAvailableZIndexes(embryoId): Observable<number> {
    return this.http.get<number>(environment.apiUrl + this.pathToListAvailableZIndex + embryoId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

  /**
   * Returns available time instants (in seconds from epoch) in which a photo of embryo exists
   * @param embryoId
   * @constructor
   */
  public listAvailableInstants(embryoId): Observable<Array<number>> {
    return this.http.get<Array<number>>(environment.apiUrl + this.pathToListAvailableInstants + embryoId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

  /**
   * Returns available time instants (in seconds from epoch) in which a photo of embryo exists
   * @param embryoId
   * @constructor
   */
  public listAvailableFullInstants(embryoId, zIndex): Observable<EmbryoInstant[]> {
    return this.http.get<EmbryoInstant[]>(environment.apiUrl + this.pathToListAvailableFullInstants + embryoId + '/zIndex/' + zIndex + '/full', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

  public getListImagesFromEmbryo (embryoId : string, z : number) : Observable <Array<EmbryoImage>> {
    let url = environment.apiUrl + this.pathToMedia + this.pathToObtainEmbryoImages;
    url = url.replace('{id}', embryoId);
    url = url.replace('{zIndex}', z.toString());
    return this.http.get<Array<EmbryoImage>> (url);
  }

  /**
   * Returns available image metadata (in EmbryoImage object format) from an embryo
   * @param embryoId
   * @constructor
   */
  public listEmbryoImagesFromEmbryo(embryoId): Observable<Array<EmbryoImage>> {
    return this.http.get<Array<EmbryoImage>>(environment.apiUrl + this.pathToListEmbryoImagesFromEmbryo + embryoId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }

  /**
   * Gets latest selected embryoImage
   */
  public getSelectedImageObservable(): Observable<EmbryoImage> {
    return this.lastLoadedEmbryoImageSubject.asObservable().pipe();
  }

  /**
   * Gets image by imageRequest from backend and emits value to all components subscribed to lastLoadedEmbryoImageSubject
   * @param request
   */
  public selectEmbryoImage(request: ImagesRequest): void {
    this.retrieveImage(request).subscribe((imageData) => {
      let embryoImageList = imageData as EmbryoImage[];
      embryoImageList[0].transformedImage = atob(embryoImageList[0].transformedImage);
      console.log('Media service - loaded new image with epoch: ' + embryoImageList[0].digitalizationTimeFromEpoch);
      this.lastLoadedEmbryoImageSubject.next(embryoImageList[0]);
    });
  }


  public retrieveImage(imageRequest: ImagesRequest): Observable<EmbryoImage[]> {
    return this.http.post<EmbryoImage[]>(environment.apiUrl + this.pathToMedia + this.pathToRetrieveImage,
                                         JSON.stringify(imageRequest), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      )
  }
}

