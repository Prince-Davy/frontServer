import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ServerService } from './service/server.service';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';



@Component({
  selector: 'app-root',
  //standalone: true,
  //imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'serverapp';
  appState$!: Observable<AppState<CustomResponse>>;

  constructor(private serverService : ServerService){
  }

  ngOnInit(): void {
    this.appState$ = this.serverService.server$
    .pipe(
      map(response => {
        return {dataState: DataState.LOADED_STATE, appData: response}
      }),
      startWith(
        {dataState: DataState.LOADIND_STATE}
        ),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR_STATE,
            error
          })
        })
    );
  }

}

