import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseComponentDirective } from '../../../../layouts/golden-layout/base-component.directive';
import {Product} from "../../../../shared/models/product";
import {PanelService} from "../../../../shared/services/panel.service";

@Component({
  selector: 'app-tree-view-component',
  templateUrl: 'tree-view.component.html',
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
export class TreeViewComponent extends BaseComponentDirective {

  public title: string;
  public color: string;
  public id: string;

  //For tree control
  public products: Product[] = [];

  constructor(@Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef, panelService: PanelService) {
    super(elRef.nativeElement);

    this.title = this.container.title;
    this.id = this.container.parent.id;
    this.products = panelService.getProducts();

  }

}

export namespace TreeViewComponent {
  export const componentTypeName = 'TreeView';
}
