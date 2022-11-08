import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseComponentDirective } from '../../../../layouts/golden-layout/base-component.directive';

@Component({
  selector: 'app-filter-builder-component',
  templateUrl: 'filter-builder.component.html',
  styles: [`
    :host {
      position: absolute;
      overflow: hidden;
    }

    #title {
      textAlign: left;
    }
  `
  ]
})
export class FilterBuilderComponent extends BaseComponentDirective {

  public title: string;
  public id: string;
  //For filter builder
  public filterValues:any[] = [];


  constructor(@Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef) {
    super(elRef.nativeElement);

    this.title = this.container.title;
    this.id = this.container.parent.id;
    this.filterValues = [
      [
        ["Product_Name", "startswith", "Super"],
        "and",
        ["Product_Cost", ">=", 300]
      ],
      "or",
      [
        ["Product_Name", "contains", "HD"],
        "and",
        ["Product_Cost", "<", 200]
      ]
    ];

  }

}

export namespace FilterBuilderComponent {
  export const componentTypeName = 'FilterBuilder';
}
