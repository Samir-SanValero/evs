import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MediaService } from './media.service';
import { BackendInterceptor } from './backend.interceptor';
import { ImagesRequest } from '../models/images-request-model';
import { createImageRequest, createVideoParams, createEmbryoImage } from './functions.mock';
import { Observable, of} from 'rxjs';
import { EmbryoImage } from '../models/embryo-image.model';


describe('MediaServiceService', () => {
  let service: MediaService;
  beforeEach(() => {
    TestBed.configureTestingModule({
    	imports: [HttpClientTestingModule],
    	providers: [HttpClient,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		}
        ],
    });
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  
  it('#getImages', () => {
	var req = createImageRequest();
	service.getImages(req).subscribe(response => {
		  expect(response.length).toBeGreaterThan(0);
	  });
  });
  
  it('#generateVideo', () => {
	var videoParams = createVideoParams("3");
	service.generateVideo (videoParams).subscribe(response => {
		  expect(typeof response).toEqual("object");
	});
  });
  it('#listAvailableZIndexes', () => {
	service.listAvailableZIndexes(1).subscribe(response => {
		  expect(response).toEqual(5);
	});
  });
  
  it('#listAvailableInstants', () => {
	service.listAvailableInstants(1).subscribe(response => {
		  expect(response.length).toEqual(1);
		  expect(response[0]).toEqual(5);
	});
  });
  
  it('#listAvailableFullInstants', () => {
	service.listAvailableFullInstants(1, 1).subscribe(response => {
		expect(response.length).toEqual(1);
		expect(response[0].instant).toEqual(3);
		expect(response[0].thumbnail).toEqual("THUMBNAILTEST");
	});
  });
  
  it('#getListImagesFromEmbryo', () => {
	service.getListImagesFromEmbryo("1", 1).subscribe(response => {
		expect(response.length).toEqual(1);
		expect(response[0].id).toEqual(2);
		expect(response[0].zIndex).toEqual(1);
	});
  });
  it('#listEmbryoImagesFromEmbryo', () => {
	  service.listEmbryoImagesFromEmbryo(1).subscribe(response => {
		  expect(response.length).toEqual(1);
		  expect(response[0].id).toEqual(2);
		  expect(response[0].fullName).toEqual("TEST");
	  });
  });
  it('#retrieveImage', () => {
	  var req = createImageRequest();
	  service.retrieveImage(req).subscribe(response => {
		  expect(response.length).toEqual(1);
		  expect(response[0].id).toEqual(2);
		  expect(response[0].fullName).toEqual("TEST");
	  });
  });
  
  it('#selectEmbryoImage', () => {
	var imageRequest : ImagesRequest = createImageRequest();
	var spy = spyOn(service, "retrieveImage").and.callFake(retrieveImageFake);;
	service.selectEmbryoImage(imageRequest);
	expect(spy).toHaveBeenCalled();
  });
  
  it('#getSelectedImageObservable', () => {
	var imageRequest : ImagesRequest = createImageRequest();
	service.selectEmbryoImage(imageRequest);
	service.getSelectedImageObservable().subscribe(response => {
		  expect(response.id).toEqual(2);
		  expect(response.fullName).toEqual("TEST");
	});
  });
  
});


function retrieveImageFake () : Observable<EmbryoImage[]>{
	var result : Observable<EmbryoImage[]>;
	var arrayEmbryoImage : Array<EmbryoImage> = new Array<EmbryoImage>();
	arrayEmbryoImage.push(createEmbryoImage(2));
	result = of(arrayEmbryoImage);
	return result;
}
  
  
