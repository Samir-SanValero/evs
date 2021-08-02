import { Observable, of } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpResponse, HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { createNotificationForTest, createAlertForTest, createEmbryoImage, createEmbryoInstant, createPatient, createEmbryo, createUser, createTag, createModel, createEmbryoStatus, createPhase } from './functions.mock';
import { Notification, NotificationAlert } from '../models/notification.model';
import { EmbryoImage } from '../models/embryo-image.model';
import { EmbryoInstant, Patient, Embryo, Tag, Model, EmbryoStatus, Phase } from '../models/patient.model';
import { User } from './authentication/user';


@Injectable()
export class BackendInterceptor implements HttpInterceptor {
	constructor(private injector: Injector) {}
	
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		
		var result = null;
		result = this.checkNotificationUrls (request); //Notifications urls
		if (result !== null) {
			return result;
		}
		result = this.checkMediaUrls (request); //Media urls
		if (result !== null) {
			return result;
		}
		result = this.checkPatientUrls (request); //Media urls
		if (result !== null) {
			return result;
		}
		result = this.checkAuthenticationUrls(request);
		if (result != null) {
			return result;
		}
		result = this.checkAnalysisUrls(request);
		if (result != null) {
			return result;
		}
		return next.handle(request);
	}
	
	checkNotificationUrls (request: HttpRequest<any>) {
		var result = null;
		if(request.method === "POST" && request.url === "https://localhost:1234/notifications/createUpdate") {
			result = of(new HttpResponse({ status: 200, body: {"result": "ok"} }));
			
	    } else if(request.method === "GET" && request.url === "https://localhost:1234/notifications/getAll") {
	    	var list : Array<Notification> = new Array<Notification>();
			var not : Notification = createNotificationForTest(1);
			list.push(not);
	    	result = of(new HttpResponse( { status: 200, body: list }));
	    	
	    } else if (request.method === "GET" && request.url === "https://localhost:1234/notifications/enabledisable") {
	    	result = of(new HttpResponse( { status: 200, body: true }));
	    	
	    } else if (request.method === "DELETE" && request.url === "https://localhost:1234/notifications/delete") {
	    	result = of(new HttpResponse( { status: 200, body: true }));
	    	
	    } else if(request.method === "GET" && request.url === "https://localhost:1234/notifications/getAlerts") {
	    	var listAlerts : Array<NotificationAlert> = new Array<NotificationAlert>();
			var alert : NotificationAlert = createAlertForTest(1);
			listAlerts.push(alert);
	    	result = of(new HttpResponse( { status: 200, body: listAlerts }));
	    }
		return result;
	}
	
	checkMediaUrls (request: HttpRequest<any>) {
		var result = null;
		if(request.method === "POST" && request.url === "https://localhost:1234/media/getImages") {
			var embryoImage : EmbryoImage = createEmbryoImage(4);
			var array : EmbryoImage[] = [];
			array[0] = embryoImage;
			result = of(new HttpResponse({ status: 200, body: array }));
		} else if(request.method === "POST" && request.url === "https://localhost:1234/media/generateVideo") {
			var arr : Array<string> = new Array<string>();
			arr.push("TEST");
			result = of(new HttpResponse({ status: 200, body: new Blob(arr) }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/media/listAvailableZIndex")) {
			result = of(new HttpResponse({ status: 200, body: 5 }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/media/listAvailableInstants/") 
				&& request.url.includes("zIndex")
				&& request.url.includes("full")) {
			var embryoInstant = createEmbryoInstant(3);
			var embryoInstantArray : Array<EmbryoInstant> = new Array<EmbryoInstant>();
			embryoInstantArray.push(embryoInstant);
			result = of(new HttpResponse({ status: 200, body: embryoInstantArray }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/media/listAvailableInstants")) {
			var arrayNumber : Array<Number> = new Array<Number>();
			arrayNumber.push(5);
			result = of(new HttpResponse({ status: 200, body: arrayNumber }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/media/listImagesFromEmbryo")
				&& request.url.includes("zIndex")) {
			var arrayEmbryoImage : Array<EmbryoImage> = new Array<EmbryoImage>();
			arrayEmbryoImage.push(createEmbryoImage(2));
			result = of(new HttpResponse({ status: 200, body: arrayEmbryoImage }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/media/listImagesFromEmbryo")) {
			var arrayEmbryoImage : Array<EmbryoImage> = new Array<EmbryoImage>();
			arrayEmbryoImage.push(createEmbryoImage(2));
			result = of(new HttpResponse({ status: 200, body: arrayEmbryoImage }));
		} else if(request.method === "POST" && request.url.includes("https://localhost:1234/media/retrieveImage")) {
			var arrayEmbryoImage : Array<EmbryoImage> = new Array<EmbryoImage>();
			arrayEmbryoImage.push(createEmbryoImage(2));
			result = of(new HttpResponse({ status: 200, body: arrayEmbryoImage }));
		} 
		return result;
	}
	
	checkPatientUrls (request: HttpRequest<any>) {
		var result = null;
		if(request.method === "GET" && request.url === "https://localhost:1234/patient") {
			var patient : Patient = createPatient();
			result = of(new HttpResponse({ status: 200, body: new Array<Patient>(patient) }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/patient/historic/")) {
			var patient : Patient = createPatient();
			result = of(new HttpResponse({ status: 200, body: new Array<Patient>(patient) }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/patient/current")) {
			var patient : Patient = createPatient();
			result = of(new HttpResponse({ status: 200, body: new Array<Patient>(patient) }));
		} else if(request.method === "PUT" && request.url.includes("https://localhost:1234/patient/")) {
			var embryo : Embryo = createEmbryo();
			result = of(new HttpResponse({ status: 200, body: embryo }));
		}
		return result;
	}
	
	checkAuthenticationUrls (request: HttpRequest<any>) {
		var result = null;
		if(request.method === "POST" && request.url === "https://localhost:1234/auth/login") {
			var user : User = createUser(3);
			result = of(new HttpResponse({ status: 200, body: user }));
		} else if(request.method === "POST" && request.url === "https://localhost:1234/auth/refresh") {
			result = of(new HttpResponse({ status: 200, body: "REFRESH_TEST" }));
		}
		
		
		return result;
	}
	
	checkAnalysisUrls (request: HttpRequest<any>) {
		var result = null;
		if(request.method === "POST" && request.url === "https://localhost:1234/auth/login") {
			var user : User = createUser(3);
			result = of(new HttpResponse({ status: 200, body: user }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/analysis/tag/embryo")) {
			var tag : Tag = createTag(3);
			result = of(new HttpResponse({ status: 200, body: tag }));
		} else if(request.method === "GET" && request.url === "https://localhost:1234/analysis/tag/base") {
			var tag : Tag = createTag(3);
			result = of(new HttpResponse({ status: 200, body: new Array<Tag>(tag) }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/analysis/model/model")) {
			var tag : Tag = createTag(3);
			result = of(new HttpResponse({ status: 200, body: tag }));
		} else if(request.method === "GET" && request.url.includes("https://localhost:1234/analysis/tag")) {
			var tag : Tag = createTag(3);
			result = of(new HttpResponse({ status: 200, body: tag }));
		} else if( (request.method === "POST" || request.method === "PUT" || request.method === "DELETE")
				&& request.url.includes ("https://localhost:1234/analysis/tag")) {
			var tag : Tag = createTag(3);
			result = of(new HttpResponse({ status: 200, body: tag }));
		} else if(request.method === "GET" && request.url === "https://localhost:1234/analysis/model") {
			var model : Model = createModel(3);
			result = of(new HttpResponse({ status: 200, body: new Array<Model>(model) }));
		} else if( (request.method === "GET" || request.method === "POST" || request.method === "PUT" || request.method === "DELETE") 
				&& request.url.includes("https://localhost:1234/analysis/model")) {
			var model : Model = createModel(3);
			result = of(new HttpResponse({ status: 200, body: model }));
		} else if(request.method === "GET" && request.url === "https://localhost:1234/analysis/status") {
			var status : EmbryoStatus = createEmbryoStatus("4");
			result = of(new HttpResponse({ status: 200, body: new Array<EmbryoStatus>(status) }));
		} else if( (request.method === "GET" || request.method === "POST" || request.method === "PUT" || request.method === "DELETE") 
				&& request.url.includes("https://localhost:1234/analysis/status")) {
			var status : EmbryoStatus = createEmbryoStatus("4");
			result = of(new HttpResponse({ status: 200, body: status }));
		} else if(request.method === "GET" && request.url === "https://localhost:1234/analysis/phase") {
			var pha : Phase = createPhase("1");
			result = of(new HttpResponse({ status: 200, body: new Array<Phase>(pha) }));
		} else if( (request.method === "GET" || request.method === "POST" || request.method === "PUT" || request.method === "DELETE") 
				&& request.url.includes("https://localhost:1234/analysis/phase")) {
			var pha : Phase = createPhase("1");
			result = of(new HttpResponse({ status: 200, body: pha }));
		}
		return result;
	}
	
	
	
	
}

