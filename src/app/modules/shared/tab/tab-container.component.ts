import { Component, Input } from '@angular/core';
@Component({
    selector: 'app-tab-container',
    templateUrl: './tab-container.component.html',
    styleUrls: ['./tab-container.component.scss'],
    exportAs: 'tab',
})
export class TabContainerComponent {
    @Input('tabTitle') title: string;
    @Input() active = false;
}
