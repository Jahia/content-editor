import {Picker} from './picker';
import {getComponentByAttr} from "@jahia/cypress";

export class PickerGrid extends Picker {

    grid: PickerGrid;

    getGrid() {
        if (!this.grid) {
            this.grid = getComponentByAttr(PickerGrid, 'data-cm-role', 'grid-content-list', this);
        }

        this.wait();
        return this.grid;
    }

    uploadFile(pathToFixture: string) {
        this.get().find('div[data-cm-role="grid-content-list"]')
            .children('div')
            .selectFile(pathToFixture, {
                action: 'drag-drop',
                waitForAnimations: true
            });
    }
}
