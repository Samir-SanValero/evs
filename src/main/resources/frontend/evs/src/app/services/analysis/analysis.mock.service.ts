import { Logger } from '../log/logger.service';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmbryoInstant, EmbryoStatus, Model, Phase, Tag } from '../../models/patient.model';
import { environment } from '../../../environments/environment';
import { createEmbryoInstant, createTag, createModel, createEmbryoStatus, createPhase } from '../functions.mock';

@Injectable()
export class AnalysisMockService {

  constructor(private logger: Logger, private http: HttpClient) { }

  	selectEmbryoInstant(embryoInstant: EmbryoInstant): Observable<EmbryoInstant> {
    	let em : EmbryoInstant = createEmbryoInstant(3);
  		return of (em);
  	}

  	getSelectedEmbryoInstantObservable(): Observable<EmbryoInstant> {
		let em : EmbryoInstant = createEmbryoInstant(3);
		return of (em);
  	}

  	selectTag(tag: Tag): Observable<Tag> {
		let t : Tag = createTag(2);
		return of(t);
  	}

	getSelectedTag(): Observable<Tag> {
		let t : Tag = createTag(2);
		return of(t);
  	}

  	selectTagList(tagList: Tag[]): Observable<Tag[]> {
		let t : Tag = createTag(2);
		return of(new Array<Tag>(t));
	}

	getSelectedTagList(): Observable<Tag[]> {
		let t : Tag = createTag(2);
		return of(new Array<Tag>(t));
	}

	getEmbryoTags(id: string): Observable<Tag> {
		let t : Tag = createTag(2);
		return of(t);
	}

	getBaseTags(): Observable<Tag[]> {
		let t : Tag = createTag(2);
		return of(new Array<Tag>(t));
	}

	getModelTags(id: string): Observable<Tag> {
		let t : Tag = createTag(2);
		return of(t);
  	}

    getTag(id: string): Observable<Tag> {
    	let t : Tag = createTag(2);
		return of(t);
    }

    createTag(tag: Tag): Observable<Tag> {
    	let t : Tag = createTag(2);
		return of(t);
    }

    updateTag(tag: Tag): Observable<Tag> {
    	let t : Tag = createTag(2);
		return of(t);
    }

    deleteTag(tagId: string): Observable<Tag> {
    	let t : Tag = createTag(2);
		return of(t);
    }

    getModels(): Observable<Model[]> {
    	let m : Model = createModel(2);
		return of(new Array<Model>(m));
    }

    getModel(id: string): Observable<Model> {
    	let m : Model = createModel(2);
		return of(m);
    }

    createModel(model: Model): Observable<Model> {
    	let m : Model = createModel(2);
		return of(m);
    }

    updateModel(model: Model): Observable<Model> {
    	let m : Model = createModel(2);
		return of(m);
    }

  // DELETE MODEL
    deleteModel(id: string): any {
    	let m : Model = createModel(2);
		return of(m);
    }

// EMBRYO STATUS
  // GET ALL EMBRYO STATUS
    getEmbryoStatuses(): Observable<EmbryoStatus[]> {
    	let e : EmbryoStatus = createEmbryoStatus("6");
		return of(new Array<EmbryoStatus>(e));
    }

  // GET EMBRYO STATUS BY ID
    getEmbryoStatus(id: string): Observable<EmbryoStatus> {
    	let e : EmbryoStatus = createEmbryoStatus("2");
		return of(e);
    }

  // CREATE EMBRYO STATUS
    createEmbryoStatus(status: EmbryoStatus): Observable<EmbryoStatus> {
    	let e : EmbryoStatus = createEmbryoStatus("2");
		return of(e);
    }

  // UPDATE EMBRYO STATUS
    updateEmbryoStatus(status: EmbryoStatus): Observable<EmbryoStatus> {
    	let e : EmbryoStatus = createEmbryoStatus("2");
		return of(e);
    }

  // DELETE EMBRYO STATUS
    deleteEmbryoStatus(embryoStatusId: string): Observable<EmbryoStatus> {
    	let e : EmbryoStatus = createEmbryoStatus("2");
		return of(e);
    }


// EMBRYO PHASE
  // GET ALL PHASE
    getPhases(): Observable<Phase[]> {
    	let p : Phase = createPhase("2");
		return of(new Array<Phase>(p));
    }

  // GET PHASE BY ID
    getPhase(id: string): Observable<Phase> {
    	let p : Phase = createPhase("2");
		return of(p);
    }

  // CREATE PHASE
    createPhase(phase: Phase): Observable<Phase> {
    	let p : Phase = createPhase("2");
		return of(p);
    }

  // UPDATE PHASE
    updatePhase(phase: Phase): Observable<Phase> {
    	let p : Phase = createPhase("2");
		return of(p);
    }

  // DELETE PHASE
    deletePhase(phaseId: string): Observable<Phase> {
    	let p : Phase = createPhase("2");
		return of(p);
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
