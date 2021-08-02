import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class SharedVariablesService {

  private selectedEmbryo: BehaviorSubject<number> = new BehaviorSubject(1);
  observableSelectedEmbryo = this.selectedEmbryo.asObservable();
  constructor() {}

  getSelectedEmbryo(): any {
    return this.selectedEmbryo.getValue();
  }

  setSelectedEmbryo(id: number): any {
    this.selectedEmbryo.next (id);
  }
}
