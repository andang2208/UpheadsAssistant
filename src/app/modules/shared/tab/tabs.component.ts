import { Component, ContentChildren, QueryList } from '@angular/core';
import { TabContainerComponent } from './tab-container.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
    @ContentChildren(TabContainerComponent)
    tabs: QueryList<TabContainerComponent>;

    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: TabContainerComponent) {
        // deactivate all tabs
        this.tabs.toArray().forEach((tab) => (tab.active = false));

        // activate the tab the user has clicked on.
        tab.active = true;
    }
}
