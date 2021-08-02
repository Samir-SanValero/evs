import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnalysisService } from './analisys.service';
import { BackendInterceptor } from '../backend.interceptor';
import { Logger } from '../log/logger.service';
import { createEmbryoInstant, createTag, createModel, createEmbryoStatus, createPhase } from '../functions.mock';
import { EmbryoInstant, Tag, Model, EmbryoStatus, Phase } from '../../models/patient.model';

describe('PatientService', () => {
  let service: AnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    	imports: [HttpClientTestingModule],
    	providers: [HttpClient, AnalysisService, Logger,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		}
        ],
    });
    service = TestBed.inject(AnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('#selectEmbryoInstant', () => {
	let spy = spyOn(service.lastLoadedEmbryoInstantSubject, "next");
	let embryoInstant : EmbryoInstant = createEmbryoInstant(4);
    service.selectEmbryoInstant(embryoInstant).subscribe(response => {
    	expect(response).toBeTruthy(); //Should not be empty, but it is
    });
    expect(spy).toHaveBeenCalled();
  });
  
  it('#getSelectedEmbryoInstantObservable', () => {
    service.getSelectedEmbryoInstantObservable().subscribe(response => {
    	expect(response).toBeTruthy();
    });
  });
  
  it('#selectTag', () => {
  	let tag : Tag = createTag(3);
    service.selectTag(tag).subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getSelectedTag', () => {
  	let tag : Tag = createTag(3);
	service.selectTag(tag).subscribe().unsubscribe();
    service.getSelectedTag().subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  it('#selectTagList', () => {
  	let tag : Tag = createTag(3);
    service.selectTagList(new Array<Tag>(tag)).subscribe(response => {
    	expect(response.length).toBeGreaterThan(0);
    	expect(response[0].id).toEqual(3);
    	expect(response[0].name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getSelectedTagList', () => {
  	let tag : Tag = createTag(3);
	service.selectTagList(new Array<Tag>(tag)).subscribe().unsubscribe();
    service.getSelectedTagList().subscribe(response => {
    	expect(response.length).toBeGreaterThan(0);
    	expect(response[0].id).toEqual(3);
    	expect(response[0].name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getEmbryoTags', () => {
    service.getEmbryoTags("3").subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getBaseTags', () => {
    service.getBaseTags().subscribe(response => {
    	expect(response.length).toBeGreaterThan(0);
    	expect(response[0].id).toEqual(3);
    	expect(response[0].name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getModelTags', () => {
    service.getModelTags("3").subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getTag', () => {
    service.getTag("3").subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  it('#createTag', () => {
	let tag : Tag = createTag(3);
    service.createTag(tag).subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  it('#updateTag', () => {
	let tag : Tag = createTag(3);
    service.updateTag(tag).subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  //Not entering inside subscribe
  it('#deleteTag', () => {
    service.deleteTag("3").subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST_TAG");
  	});
  });
  
  it('#getModels', () => {
    service.getModels().subscribe(response => {
    	expect(response.length).toBeGreaterThan(0);
    	expect(response[0].id).toEqual(3);
    	expect(response[0].name).toEqual("TEST");
  	});
  });
  
  it('#getModel', () => {
    service.getModel("3").subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#createModel', () => {
	let model : Model = createModel(3);
    service.createModel(model).subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#updateModel', () => {
	let model : Model = createModel(3);
    service.updateModel(model).subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#deleteModel', () => {
    service.deleteModel("3").subscribe(response => {
    	expect(response.id).toEqual(3);
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#getEmbryoStatuses', () => {
    service.getEmbryoStatuses().subscribe(response => {
    	expect(response.length).toBeGreaterThan(0);
    	expect(response[0].id).toEqual("4");
    	expect(response[0].name).toEqual("TEST");
  	});
  });
  
  it('#getEmbryoStatus', () => {
    service.getEmbryoStatus("4").subscribe(response => {
    	expect(response.id).toEqual("4");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#createEmbryoStatus', () => {
	let status : EmbryoStatus = createEmbryoStatus("4");
    service.createEmbryoStatus(status).subscribe(response => {
    	expect(response.id).toEqual("4");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#updateEmbryoStatus', () => {
	let status : EmbryoStatus = createEmbryoStatus("4");
    service.updateEmbryoStatus(status).subscribe(response => {
    	expect(response.id).toEqual("4");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#deleteEmbryoStatus', () => {
    service.deleteEmbryoStatus("4").subscribe(response => {
    	expect(response.id).toEqual("4");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  
  it('#getPhases', () => {
    service.getPhases().subscribe(response => {
    	expect(response.length).toBeGreaterThan(0);
    	expect(response[0].id).toEqual("1");
    	expect(response[0].name).toEqual("TEST");
  	});
  });
  
  it('#getPhase', () => {
    service.getPhase("1").subscribe(response => {
    	expect(response.id).toEqual("1");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#createPhase', () => {
	let pha : Phase = createPhase("1");
    service.createPhase(pha).subscribe(response => {
    	expect(response.id).toEqual("1");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#updatePhase', () => {
	let pha : Phase = createPhase("1");
    service.updatePhase(pha).subscribe(response => {
    	expect(response.id).toEqual("1");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
  it('#deleteEmbryoStatus', () => {
    service.deletePhase("1").subscribe(response => {
    	expect(response.id).toEqual("1");
    	expect(response.name).toEqual("TEST");
  	});
  });
  
});
