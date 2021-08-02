import { Notification, NotificationReminder, NotificationAlert } from '../models/notification.model';
import { EmbryoImage } from '../models/embryo-image.model';
import { ImagesRequest } from '../models/images-request-model';
import { VideoParams } from '../models/video-params-model';
import { EmbryoInstant, Patient, PartnerData, PatientData, InseminationData, Embryo, EmbryoStatus, InseminationType, Tag, Model, Phase } from '../models/patient.model';
import { User } from './authentication/user';

export function createNotificationForTest (id : number = -1) : Notification {
	let reminder : NotificationReminder = new NotificationReminder();
	reminder.monday = true;
	let not : Notification = new Notification();
	not.id = id;
	not.name = "TEST";
	not.chamber = 1;
	not.comment = "TEST COMMENT";
	not.dateReminder = new Date();
	not.reminder = reminder;
	not.active = false;
	not.embryos = null;
	not.deleted = true;
	not.alerts = null;
	return not;
}

export function createAlertForTest (id : number = -1, not_id : number = -1) : NotificationAlert {
	let alert : NotificationAlert = new NotificationAlert();
	alert.id = id;
	alert.triggerDate = new Date();
	alert.notificationId = not_id;
	return alert;
}

export function createEmbryoImage (id : number = -1) : EmbryoImage {
	let result = new EmbryoImage ();
	result.id = id;
	result.fullName = "TEST";
	result.zIndex = 1;
	result.digitalizationTimeFromEpoch = 5;
	result.path = "/TEST_PATH";
	result.image = null;
	result.width = 200;
	result.height = 200;
	result.transformedImage = null;
	return result;
}

export function createImageRequest () : ImagesRequest {
	let req : ImagesRequest = new ImagesRequest();
	req.imagesIds = new Array<number>();
	req.imagesIds.push(1);
	req.imageWidth = 200;
	req.z = 1;
	return req;
}

export function createVideoParams (id : string = "") : VideoParams {
	let result : VideoParams = new VideoParams();
	result.audio = null;
	result.text = "TEST TEXT";
	result.format = "";
	result.frameRate = 24;
	result.showTime = false;
	result.fontType = "Helvetica";
	result.fontColor = "red";
	result.textPosition = "";
	result.logo = null;
	result.startImage = null;
	result.endImage = null;
	result.id = id;
	result.width = 200;
	result.height = 200;
	result.z = 1;
	return result;
}

export function createEmbryoInstant (instant : number = 6) : EmbryoInstant {
	let result : EmbryoInstant = new EmbryoInstant();
	result.instant = instant;
	result.thumbnail = "THUMBNAILTEST";
	return result;
}

export function createPatient () : Patient {
	let arrayEmbryo : Array<Embryo> = new Array<Embryo>();
	let embryo = createEmbryo("6");
	arrayEmbryo.push(embryo);
	let result : Patient = new Patient();
	result.patientData = createPatientData(7);
	result.partnerData = createPartnerData("5");
	result.inseminationData = createInseminationData("5");
	result.embryos = arrayEmbryo;
	result.eTag = "TEST";
	return result;
}

export function createEmbryo (id : string = "3") : Embryo {
	let result : Embryo = new Embryo();
	result.id = id;
	result.dishLocationNumber = 5;
	result.status = createEmbryoStatus("4");
	result.selected = true;
	result.inseminationDate = "2021/02/23";
	result.photoFolder = "/opt/evsclient";
	result.tags = null;
	result.phases = null;
	result.externalId = "TESTID";
	result.centeredImage = createEmbryoImage(3);
	result.images = null;
	result.eTag = "TESTTAG";
	return result;
}

export function createEmbryoStatus (id : string = "-1") : EmbryoStatus {
	let result : EmbryoStatus = new EmbryoStatus();
	result.id = id;
	result.name = "TEST";
	result.color = "red";
	result.description = "TEST_DESCRIPTION";
	return result;
}

export function createPatientData (id : number = 8) : PatientData {
	let result : PatientData = new PatientData();
	result.id = 8;
	result.dish = "3";
	result.name = "TESTNAME";
	result.photo = "/path/image.jpg";
	result.comment = "TESTCOMMENT";
	result.addedInformation = "TEST";
	return result;
}

export function createPartnerData (id : string = "8") : PartnerData {
	let result : PartnerData = new PartnerData();
	result.id = id
	result.name = "TEST_PARTNER";
	result.comment = "TEST_COMMENT";
	return result;
}

export function createInseminationData (id : string = "8") : InseminationData {
	let result : InseminationData = new InseminationData();
	result.inseminationDate = "2021/02/23";
	result.type = createInseminationType(9);
	result.comment = "TEST";
	return result;
}

export function createInseminationType (id : number = 5) : InseminationType {
	let result : InseminationType = new InseminationType();
	result.id = id
	result.name = "TEST";
	return result;
}

export function createUser (id : number = 3) : User {
	let result : User = new User();
	result.id = id;
	result.username = "TEST_NAME";
	result.password = "TEST_PASSWORD";
	result.authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
	result.refreshToken = "xRxGGEpVawiUak6He367W3oeOfh+3irw+1G1h1jc";
	return result;
}

export function createTag (id : number = 8) : Tag {
	let result : Tag = new Tag();
	result.id = id;
	result.name = "TEST_TAG";
	result.description = "TEST_DESC";
	result.acronym = "";
	result.comment = "";
	result.type = "";
	result.time = 1234;
	result.start = "4567";
	result.end = "7891";
	result.score = 2;
	result.repeatable = false;
	result.canvas = null;
	result.morphologicalEvents = null;
	result.eventsView = null;
	result.dateView = null;
	result.embryoHour = null;
	result.imageView = null;
	return result;
}

export function createModel (id : number = 7) : Model {
	let result : Model = new Model();
	result.id = id;
	result.name = "TEST";
	result.tags = null;
	return result;
}

export function createPhase (id : string = "1") : Phase {
	let result : Phase = new Phase();
	result.id = id;
	result.type = "TEST";
	result.acronym = "TEST";
	result.name = "TEST";
	result.startTime = 16584;
	result.endTime = 325136;
	return result
}






