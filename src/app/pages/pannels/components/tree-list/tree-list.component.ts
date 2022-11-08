import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseComponentDirective } from '../../../../layouts/golden-layout/base-component.directive';
import {Employee} from "../../../../shared/models/employee";
import {EmployeesService} from "../../../../shared/services/employee.service";

@Component({
  selector: 'app-tree-list-component',
  templateUrl: 'tree-list.component.html',
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
export class TreeListComponent extends BaseComponentDirective {

  public title: string;
  public id: string;
  //For tree list
  employees: Employee[] = [];


  constructor(@Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef, employeeService: EmployeesService) {
    super(elRef.nativeElement);

    this.title = this.container.title;
    this.id = this.container.parent.id;
    this.employees = employeeService.getEmployees();

  }

}

export namespace TreeListComponent {
  export const componentTypeName = 'TreeList';
}
