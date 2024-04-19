import { Component, OnInit } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from "@angular/router";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { LogoutComponent } from "../logout/logout.component";
@Component({
  selector: "app-welcome",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterModule,
    LogoutComponent,
  ],
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;
  constructor() {}

  ngOnInit() {}
}
