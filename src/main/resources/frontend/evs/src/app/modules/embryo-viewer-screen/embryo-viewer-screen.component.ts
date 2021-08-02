import { Component } from '@angular/core';

@Component({
  selector: 'app-viewer-screen',
  templateUrl: './embryo-viewer-screen.component.html',
  styleUrls: ['./embryo-viewer-screen.component.scss']
})
export class EmbryoViewerScreenComponent {

  showModal: boolean = false;
  
  constructor() {}

  receiveShowModal(showModal) {
    this.showModal = showModal;
  }
}
