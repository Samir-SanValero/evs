import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';

@Component({
  selector: 'app-setting-tags',
  templateUrl: './setting-tags.component.html',
  styleUrls: ['./setting-tags.component.css']
})
export class SettingTagsComponent implements OnInit {

  tags: Tag[];
  editingTag: Tag;

  private tagSubscription: Subscription;

  constructor(public analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.tagSubscription = this.analysisService.getBaseTags().subscribe((tagData) => {
      this.tags = tagData as Tag[];

      console.log('Settings embryo tags component - loaded tags: ' + this.tags.length);
    });
  }

  /**
   * Select tag for editing
   * @param tag that's being edited
   */
  selectTag(tag: Tag): void {
    this.editingTag = tag;
  }

  /**
   * Generates new tag
   */
  addTag(): void {
    this.editingTag = new Tag();
    this.editingTag.description = 'New tag';
    this.editingTag.name = 'tag';
    this.editingTag.acronym = '';
    this.editingTag.comment = '';
    this.editingTag.description = '';
    this.editingTag.type = 'BASE';
  }

  /**
   * Removes tag
   */
  removeTag(): void {
    console.log('Deactivating tag');
    this.tags.forEach( (tag, index) => {
      if (tag === this.editingTag) {
        this.tags.splice(index, 1);

        if (this.tagSubscription != null) {
          this.tagSubscription.unsubscribe();
        }

        this.tagSubscription = this.analysisService.deleteTag(this.editingTag.id + '').subscribe((tagData) => {
          console.log('Deactivated tag');
        });
      }
    });
  }

  /**
   * Saves new tag
   */
  saveTag(): void {
    let alreadyExists = false;
    for (const tag of this.tags) {
      if (tag === this.editingTag) {
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      this.tags.push(this.editingTag);

      if (this.tagSubscription != null) {
        this.tagSubscription.unsubscribe();
      }

      this.tagSubscription = this.analysisService.createTag(this.editingTag).subscribe((tagData) => {
        console.log('Created tag');
      });
    } else {
      this.tagSubscription = this.analysisService.updateTag(this.editingTag).subscribe((tagData) => {
        console.log('Updated tag');
      });
    }
  }

}
