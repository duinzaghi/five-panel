import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseComponentDirective } from '../../../../layouts/golden-layout/base-component.directive';
import {Task} from "../../../../shared/models/task";
import {Dependency} from "../../../../shared/models/dependency";
import {Resource} from "../../../../shared/models/resource";
import {ResourceAssignment} from "../../../../shared/models/resourceAssignment";
import { PanelService } from '../../../../shared/services/panel.service';
import {TaskDataService} from "../../../../shared/services/task.service";
import {DependencyDataService} from "../../../../shared/services/dependency.service";
import {ResourceAssignmentDataService} from "../../../../shared/services/resourceAssignment.service";
import {ResourceDataService} from "../../../../shared/services/resource.service";

@Component({
  selector: 'app-gantt-component',
  templateUrl: 'gantt.component.html',
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
export class GanttComponent extends BaseComponentDirective {

  public title: string;
  public id: string;

  //For Gantt
  tasks: Task[];
  dependencies: Dependency[];
  resources: Resource[];
  resourceAssignments: ResourceAssignment[];

  constructor(
      @Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken)
      private container: ComponentContainer,
      elRef: ElementRef,
      panelService: PanelService,
      taskService: TaskDataService,
      dependencyService: DependencyDataService,
      resourceService: ResourceDataService,
      resourceAssignmentService: ResourceAssignmentDataService,
  ) {
    super(elRef.nativeElement);

    this.title = this.container.title;
    this.id = this.container.parent.id;
    //For gantt
    taskService.getAll().subscribe(data => {
      this.tasks = data;
    });
    dependencyService.getAll().subscribe(data => {
      this.dependencies = data;
    });
    resourceService.getAll().subscribe(data => {
      this.resources = data;
    });
    resourceAssignmentService.getAll().subscribe(data => {
      this.resourceAssignments = data;
    });
  }

}

export namespace GanttComponent {
  export const componentTypeName = 'Gantt';
}
