import {Component, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import { PanelService } from '../../shared/services/panel.service';
import {Panel} from "../../shared/models/panel";
import {GoldenControlsComponent} from "../../layouts/golden-layout/controls.component";
import {GoldenLayoutHostComponent} from "../../layouts/golden-layout/golden-layout-host.component";

@Component({
  templateUrl: 'panels.component.html',
  styleUrls: [ './panel.component.scss' ]
})

export class PanelsComponent {
  panels: Panel[] = [];

  constructor(panelService: PanelService) {
    this.panels = panelService.getPanels();
  }

  private _controlsElement: HTMLElement;

  @ViewChild('controls') private _controlsComponent: GoldenControlsComponent;
  @ViewChild('goldenLayoutHost') private _goldenLayoutHostComponent: GoldenLayoutHostComponent;

  ngAfterViewInit() {
    setTimeout(() => {
      this._controlsElement = this._controlsComponent.element;

      this._goldenLayoutHostComponent.initialise();
      this._controlsComponent.initialise(this._goldenLayoutHostComponent);

      if (this._goldenLayoutHostComponent.isGoldenLayoutSubWindow) {
        this._controlsElement.style.display = 'none';
      }
    }, 0);
  }
}
