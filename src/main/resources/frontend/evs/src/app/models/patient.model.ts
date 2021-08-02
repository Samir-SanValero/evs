import { EmbryoImage } from './embryo-image.model';

export class Tag {
  id: number;
  name: string;
  description: string;
  acronym: string;
  comment: string;

  // TYPES BASE, EMBRYO, MODEL
  type: string;

  // Embryo attributes
  time: number;

  // Model attributes
  start: string;
  end: string;
  score: number;
  repeatable: boolean;

  // Special atributes
  canvas: string;

  morphologicalEvents: MorphologicalEvent[];

  // view attributes
  eventsView: MorphologicalEvent[];
  dateView: string;
  embryoHour: string;
  imageView: EmbryoImage;
  constructor() {}
}

export class MorphologicalEvent {
  id: string;
  acronym: string;
  name: string;
  description: string;
  options: string[];
  value: string;
  type: string;

  constructor() {}
}

export class Model {
  id: number;
  name: string;
  tags: Array<Tag>;

  constructor() {}
}

export class ModelViewScore {
  model: string;
  score: number;

  constructor() {}
}

export class PatientData {
  id: number;
  dish: string;
  name: string;
  photo: string;
  comment: string;
  addedInformation: string;
}

export class PartnerData {
  id: string;
  name: string;
  comment: string;
}

export class InseminationData {
  inseminationDate: string;
  type: InseminationType;
  comment: string;
}

export class EmbryoStatus {
  id: string;
  name: string;
  color: string;
  description: string;
}

export class Phase {
  // Constants
  TYPE_BASE = 'BASE';
  TYPE_EMBRYO = 'EMBRYO';

  id: string;
  type: string;

  acronym: string;
  name: string;

  startTime = 0;
  endTime = 0;
}

export class Embryo {
  id: string;
  dishLocationNumber: number;
  status: EmbryoStatus;
  selected: boolean;
  inseminationDate: string;
  photoFolder: string;
  tags: Array<Tag>;
  phases: Array<Phase>;
  externalId: string;

  centeredImage: EmbryoImage;
  images: Array<EmbryoImage>;

  // Embryo versioning control for concurrent saves
  eTag: string;
}

export class EmbryoInstant {
  instant: number;
  thumbnail: string;
}

export class InseminationType {
  id: number;
  name: string;
}

export class Patient {
  patientData: PatientData;
  partnerData: PartnerData;
  inseminationData: InseminationData;
  embryos: Array<Embryo>;

  // Patient versioning control for concurrent saves
  eTag: string;
}
