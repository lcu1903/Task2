import { Routes } from "@angular/router";
import { WelcomeComponent } from "./welcome.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { AuthGuard } from "../../guard/auth.guard";

export const WELCOME_ROUTES: Routes = [
  { path: "", component: WelcomeComponent },

];
