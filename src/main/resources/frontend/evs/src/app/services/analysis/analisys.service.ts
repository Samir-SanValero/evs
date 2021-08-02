import { Logger } from '../log/logger.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmbryoInstant, EmbryoStatus, Model, MorphologicalEvent, Phase, Tag } from '../../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnalysisService {

  public lastLoadedTagSubject: BehaviorSubject<Tag> = new BehaviorSubject<Tag>(new Tag());
  public lastLoadedEmbryoInstantSubject: BehaviorSubject<EmbryoInstant> = new BehaviorSubject<EmbryoInstant>(new EmbryoInstant());
  public lastLoadedTagList: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

  constructor(private logger: Logger, private http: HttpClient) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  selectEmbryoInstant(embryoInstant: EmbryoInstant): Observable<EmbryoInstant> {
    this.lastLoadedEmbryoInstantSubject.next(embryoInstant);
    return this.lastLoadedEmbryoInstantSubject.asObservable();
  }

  getSelectedEmbryoInstantObservable(): Observable<EmbryoInstant> {
    return this.lastLoadedEmbryoInstantSubject.asObservable().pipe();
  }

  selectTag(tag: Tag): Observable<Tag> {
    this.lastLoadedTagSubject.next(tag);
    return this.lastLoadedTagSubject.asObservable();
  }

  getSelectedTag(): Observable<Tag> {
    return this.lastLoadedTagSubject.asObservable().pipe();
  }

  selectTagList(tagList: Tag[]): Observable<Tag[]> {
    this.lastLoadedTagList.next(tagList);
    return this.lastLoadedTagList.asObservable();
  }

  getSelectedTagList(): Observable<Tag[]> {
    return this.lastLoadedTagList.asObservable().pipe();
  }

// TAGS
  // GET ALL TAGS
    getEmbryoTags(id: string): Observable<Tag> {
      return this.http.get<Tag>(environment.apiUrl + environment.tagUrl + '/embryo' + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // GET ALL BASE TAGS
    getBaseTags(): Observable<Tag[]> {
      return this.http.get<Tag[]>(environment.apiUrl + environment.tagUrl + '/base', this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // GET ALL TAGS OF MODEL
    getModelTags(id: string): Observable<Tag> {
      return this.http.get<Tag>(environment.apiUrl + environment.modelUrl + '/model' + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // GET TAG BY ID
    getTag(id: string): Observable<Tag> {
      return this.http.get<Tag>(environment.apiUrl + environment.tagUrl + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // CREATE TAG
    createTag(tag: Tag): Observable<Tag> {
      return this.http.post<Tag>(environment.apiUrl + environment.tagUrl, JSON.stringify(tag), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // UPDATE TAG
    updateTag(tag: Tag): Observable<Tag> {
      return this.http.put<Tag>(environment.apiUrl + environment.tagUrl + '/' + tag.id, JSON.stringify(tag), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // DELETE TAG
    deleteTag(tagId: string): Observable<Tag> {
      return this.http.delete<Tag>(environment.apiUrl + environment.tagUrl + '/' + tagId, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

// MODELS
  // GET ALL MODELS
    getModels(): Observable<Model[]> {
      return this.http.get<Model[]>(environment.apiUrl + environment.modelUrl, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // GET MODEL BY ID
    getModel(id: string): Observable<Model> {
      return this.http.get<Model>(environment.apiUrl + environment.modelUrl + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // CREATE MODEL
    createModel(model: Model): Observable<Model> {
      return this.http.post<Model>(environment.apiUrl + environment.modelUrl, JSON.stringify(model), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // UPDATE MODEL
    updateModel(model: Model): Observable<Model> {
      return this.http.put<Model>(environment.apiUrl + environment.modelUrl + '/' + model.id, JSON.stringify(model), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // DELETE MODEL
    deleteModel(id: string): any {
      return this.http.delete<Model>(environment.apiUrl + environment.modelUrl + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

// EMBRYO STATUS
  // GET ALL EMBRYO STATUS
    getEmbryoStatuses(): Observable<EmbryoStatus[]> {
      return this.http.get<EmbryoStatus[]>(environment.apiUrl + environment.embryoStatusUrl, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // GET EMBRYO STATUS BY ID
    getEmbryoStatus(id: string): Observable<EmbryoStatus> {
      return this.http.get<EmbryoStatus>(environment.apiUrl + environment.embryoStatusUrl + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // CREATE EMBRYO STATUS
    createEmbryoStatus(status: EmbryoStatus): Observable<EmbryoStatus> {
      return this.http.post<EmbryoStatus>(environment.apiUrl + environment.embryoStatusUrl, JSON.stringify(status), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // UPDATE EMBRYO STATUS
    updateEmbryoStatus(status: EmbryoStatus): Observable<EmbryoStatus> {
      return this.http.put<EmbryoStatus>(environment.apiUrl + environment.embryoStatusUrl + '/' + status.id, JSON.stringify(status), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // DELETE EMBRYO STATUS
    deleteEmbryoStatus(embryoStatusId: string): Observable<EmbryoStatus> {
      return this.http.delete<EmbryoStatus>(environment.apiUrl + environment.embryoStatusUrl + '/' + embryoStatusId, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }


// EMBRYO PHASE
  // GET ALL PHASE
    getAllBasePhases(): Observable<Phase[]> {
      return this.http.get<Phase[]>(environment.apiUrl + environment.phaseUrl + '/base', this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // GET PHASE BY ID
    getPhase(id: string): Observable<Phase> {
      return this.http.get<Phase>(environment.apiUrl + environment.phaseUrl + id, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // CREATE PHASE
    createPhase(phase: Phase): Observable<Phase> {
      return this.http.post<Phase>(environment.apiUrl + environment.phaseUrl, JSON.stringify(phase), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // UPDATE PHASE
    updatePhase(phase: Phase): Observable<Phase> {
      return this.http.put<Phase>(environment.apiUrl + environment.phaseUrl + '/' + phase.id, JSON.stringify(phase), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

  // DELETE PHASE
    deletePhase(phaseId: string): Observable<Phase> {
      return this.http.delete<Phase>(environment.apiUrl + environment.phaseUrl + '/' + phaseId, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandle)
        );
    }

// MORPHOLOGICAL EVENT
  // GET ALL EVENTS
  getBaseMorphologicalEvents(): Observable<MorphologicalEvent[]> {
    return this.http.get<MorphologicalEvent[]>(environment.apiUrl + environment.morphologicalEventUrl + '/base', this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  // GET EVENT BY ID
  getMorphologicalEvent(id: string): Observable<MorphologicalEvent> {
    return this.http.get<MorphologicalEvent>(environment.apiUrl + environment.morphologicalEventUrl + id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  // CREATE EVENT
  createMorphologicalEvent(morphologicalEvent: MorphologicalEvent): Observable<MorphologicalEvent> {
    return this.http.post<MorphologicalEvent>(environment.apiUrl + environment.morphologicalEventUrl, JSON.stringify(morphologicalEvent), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  // UPDATE EVENT
  updateMorphologicalEvent(morphologicalEvent: MorphologicalEvent): Observable<MorphologicalEvent> {
    return this.http.put<MorphologicalEvent>(environment.apiUrl + environment.morphologicalEventUrl + '/' + morphologicalEvent.id, JSON.stringify(morphologicalEvent), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  // DELETE EVENT
  deleteMorphologicalEvent(eventId: string): Observable<MorphologicalEvent> {
    return this.http.delete<MorphologicalEvent>(environment.apiUrl + environment.morphologicalEventUrl + '/' + eventId, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }


  // Error handling
  errorHandle(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
