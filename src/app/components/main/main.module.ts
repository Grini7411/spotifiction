import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MainComponent} from "./main.component";
import {TrackCardComponent} from "../trackCard/track-card.component";
import {NgxAudioPlayerModule} from "ngx-audio-player";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from '@angular/material/dialog';

import {TrackInfoComponent} from "../track-info/track-info.component";



@NgModule({
  declarations: [MainComponent, TrackCardComponent, TrackInfoComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatFormFieldModule,
    NgxAudioPlayerModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class MainModule { }
