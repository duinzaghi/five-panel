import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseComponentDirective } from '../../../../layouts/golden-layout/base-component.directive';

@Component({
  selector: 'app-diagram-component',
  templateUrl: 'diagram.component.html',
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
export class DiagramComponent extends BaseComponentDirective {

  public title: string;
  public id: string;


  constructor(@Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef) {
    super(elRef.nativeElement);

    this.title = this.container.title;
    this.id = this.container.parent.id;

  }

  styleExpr() {
    return { "stroke": "red" };
  }
  textStyleExpr() {
    return { "fill": "green" };
  }

}

export namespace DiagramComponent {
  export const componentTypeName = 'Diagram';
}
