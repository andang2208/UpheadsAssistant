import { Component } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor() {}
}
