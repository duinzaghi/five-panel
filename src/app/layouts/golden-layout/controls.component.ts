import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {
    DragSource,
    GoldenLayout,
    LayoutConfig,
    ResolvedLayoutConfig
} from "golden-layout";
import {ColorComponent} from "./color.component";
import {GoldenLayoutComponentService} from './golden-layout-component.service';
import {GoldenLayoutHostComponent} from './golden-layout-host.component';
import {predefinedLayoutNames, predefinedLayouts} from './predefined-layouts';
import {TextComponent} from './text.component';
import {TreeViewComponent} from "../../pages/pannels/components/tree-view/tree-view.component";
import {FilterBuilderComponent} from "../../pages/pannels/components/filter-builder/filter-builder.component";
import {DiagramComponent} from "../../pages/pannels/components/diagram/diagram.component";
import {GanttComponent} from "../../pages/pannels/components/gantt/gantt.component";
import {TreeListComponent} from "../../pages/pannels/components/tree-list/tree-list.component";

@Component({
    selector: 'app-golden-controls',
    template: `
        <div class="hidden-controls">
            <section id="virtualOrEmbeddedSection">
                <section id="embeddedSection">
                    <section id="embeddedRadioSection">
                        <input #embeddedRadio
                               id="embeddedRadio"
                               type="radio"
                               name="virtualOrEmbedded"
                        />
                        <label for="embeddedRadio">Embedded</label>
                    </section>
                </section>
                <section id="virtualSection">
                    <section id="virtualRadioSection">
                        <input #virtualRadio
                               id="virtualRadio"
                               type="radio"
                               name="virtualOrEmbedded"
                        />
                        <label for="virtualRadio">Virtual</label>
                    </section>
                    <section id="viewComponentRefOrAppRefSection">
                        <section id="viewComponentRefRadioSection">
                            <input #viewComponentRefRadio
                                   id="viewComponentRefRadio"
                                   type="radio"
                                   name="viewComponentRefOrAppRef"
                            />
                            <label for="viewComponentRefRadio">View Comp Ref</label>
                        </section>
                        <section id="appRefRadioSection">
                            <input #appRefRadio
                                   id="appRefRadio"
                                   type="radio"
                                   name="viewComponentRefOrAppRef"
                            />
                            <label for="appRefRadio">App Ref</label>
                        </section>
                    </section>
                </section>
            </section>
            <section id="predefinedLayoutsSection">
                <select #layoutSelect
                        id="layoutSelect"
                        class="control"
                        [value]="initialLayoutName"
                        (change)="handleLayoutSelectChange(layoutSelect.value)"
                >
                    <option *ngFor="let name of layoutNames">{{name}}</option>
                </select>
                <button #loadLayoutButton id="loadLayoutButton" class="control" (click)="handleLoadLayoutButtonClick()">
                    Load Layout
                </button>
            </section>
            <section id="saveAndReloadLayoutSection">
                <button #saveLayoutButton id="saveLayoutButton" class="control" (click)="handleSaveLayoutButtonClick()">
                    Save Layout
                </button>
                <button #reloadSavedLayoutButton
                        id="reloadSavedLayoutButton"
                        class="control"
                        [disabled]="saveLayoutButtonDisabled === true ? true : null"
                        (click)="handleReloadSavedLayoutClick()"
                >Reload saved Layout
                </button>
            </section>
        </div>
        <section id="dragSection">
            <div>
                <button class="draggable control" #treeView>Tree View</button>
                <button class="draggable control" #filterBuilder> Filter Builder</button>
                <button class="draggable control" #diagram> Diagram</button>
                <button class="draggable control" #gantt> Gantt</button>
                <button class="draggable control" #treeList> Tree List</button>
            </div>
        </section>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            white-space: nowrap;
        }

        .control {
            margin: 2px;
        }

        .draggable {
            cursor: move;
        }

        .hidden-controls {
            display: none;
        }

        #viewComponentRefOrAppRefSection {
            display: flex;
            margin-left: 1em;
        }

        #addComponentSection {
            display: flex;
            flex-direction: row;
        }

        #addTextComponentSection {
            display: flex;
            flex-direction: row;
        }

        #predefinedLayoutsSection {
            display: flex;
            flex-direction: row;
        }

        #saveAndReloadLayoutSection {
            display: flex;
            flex-direction: row;
        }

        #dragSection {
            display: flex;
            flex-direction: column;
        }
    `
    ]
})
export class GoldenControlsComponent implements OnDestroy {
    private _goldenLayoutHostComponent: GoldenLayoutHostComponent;
    private _goldenLayout: GoldenLayout;
    private _savedLayout: ResolvedLayoutConfig | undefined;

    private _selectedRegisteredComponentTypeName: string;
    private _componentTextValue: string;
    private _selectedLayoutName: string;
    private _dragSources: Array<DragSource | undefined> = [];

    @ViewChild('dragMe') private _dragMeElementRef: ElementRef;
    @ViewChild('treeView') private _treeViewElementRef: ElementRef;
    @ViewChild('filterBuilder') private _filterBuilderElementRef: ElementRef;
    @ViewChild('diagram') private _diagramElementRef: ElementRef;
    @ViewChild('gantt') private _ganttElementRef: ElementRef;
    @ViewChild('treeList') private _treeListElementRef: ElementRef;
    @ViewChild('virtualRadio') private _virtualRadioElementRef: ElementRef<HTMLInputElement>;
    @ViewChild('viewComponentRefRadio') private _viewComponentRefRadioElementRef: ElementRef<HTMLInputElement>;
    @ViewChild('appRefRadio') private _appRefRadioElementRef: ElementRef<HTMLInputElement>;

    public registeredComponentTypeNames: readonly string[];
    public initialRegisteredComponentTypeName: string;
    public initialComponentTextValue = 'Water';
    public layoutNames: readonly string[] = [];
    public initialLayoutName: string;
    public saveLayoutButtonDisabled = true;

    get element() {
        return this._elRef.nativeElement;
    }

    constructor(private _elRef: ElementRef<HTMLElement>,
                private _goldenLayoutComponentService: GoldenLayoutComponentService
    ) {
    }

    ngOnDestroy() {
        for (const dragSource of this._dragSources) {
            if (dragSource) {
                this._goldenLayout.removeDragSource(dragSource);
            }
        }
    }

    initialise(value: GoldenLayoutHostComponent) {
        this._goldenLayoutHostComponent = value;
        this._goldenLayout = this._goldenLayoutHostComponent.goldenLayout;

        this._virtualRadioElementRef.nativeElement.checked = this._goldenLayoutHostComponent.virtualActive;
        this.registeredComponentTypeNames = this._goldenLayoutComponentService.getRegisteredComponentTypeNames();
        this._selectedRegisteredComponentTypeName = this.registeredComponentTypeNames[0]
        this.initialRegisteredComponentTypeName = this._selectedRegisteredComponentTypeName;
        this._componentTextValue = this.initialComponentTextValue;
        this.layoutNames = predefinedLayoutNames;
        this._selectedLayoutName = this.layoutNames[0]
        this.initialLayoutName = this._selectedLayoutName;

        this.initialiseDragSources();
    }


    handleLayoutSelectChange(value: string) {
        this._selectedLayoutName = value;
    }

    handleLoadLayoutButtonClick() {
        const selectedLayout = predefinedLayouts.find((layout) => layout.name === this._selectedLayoutName);
        if (selectedLayout === undefined) {
            throw new Error('handleLoadLayoutButtonClick Error');
        } else {
            this._goldenLayout.loadLayout(selectedLayout.config);
        }
    }

    handleSaveLayoutButtonClick() {
        this._savedLayout = this._goldenLayout.saveLayout();
        this.saveLayoutButtonDisabled = false;
    }

    handleReloadSavedLayoutClick() {
        if (this._savedLayout === undefined) {
            throw new Error('No saved layout');
        } else {
            const layoutConfig = LayoutConfig.fromResolved(this._savedLayout);
            this._goldenLayout.loadLayout(layoutConfig);
        }
    }

    private initialiseDragSources() {
        this.loadDragSource('Tree View !', TreeViewComponent.componentTypeName, this._treeViewElementRef);
        this.loadDragSource('Filter Builder !', FilterBuilderComponent.componentTypeName, this._filterBuilderElementRef);
        this.loadDragSource('Diagram !', DiagramComponent.componentTypeName, this._diagramElementRef);
        this.loadDragSource('Gantt !', GanttComponent.componentTypeName, this._ganttElementRef);
        this.loadDragSource('Tree List !', TreeListComponent.componentTypeName, this._treeListElementRef);
    }

    private loadDragSource(title: string, componentName: string, element: ElementRef | undefined): void {
        if (!this._goldenLayout) {
            return;
        }

        const config = () => {
            const item: DragSource.ComponentItemConfig = {
                state: undefined,
                title,
                type: componentName,
            };
            return item;
        };
        this._dragSources.push(this._goldenLayout.newDragSource(element?.nativeElement, config));
    }

}
