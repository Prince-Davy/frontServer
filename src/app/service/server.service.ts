import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { Observable, throwError } from 'rxjs';
import { catchError, tap,  } from 'rxjs/operators';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'any';

  constructor(private http: HttpClient) {

   }
   server$ = <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/servers/list`)
   .pipe(
    tap(console.log),
    catchError(this.handleError)
   );

   save$ = (server: Server) => <Observable<CustomResponse>> this.http.post<CustomResponse>(`${this.apiUrl}/servers/save`, server)
   .pipe(
    tap(console.log),
    catchError(this.handleError)
   );

   ping$ = (ipAddress: string) => <Observable<CustomResponse>> this.http.get<CustomResponse>(`${this.apiUrl}/servers/ping/${ipAddress}`)
   .pipe(
    tap(console.log),
    catchError(this.handleError)
   );


   delete$ = (serverId: number) => <Observable<CustomResponse>> this.http.post<CustomResponse>(`${this.apiUrl}/servers/delete/${serverId}`, serverId)
   .pipe(
    tap(console.log),
    catchError(this.handleError)
   );

   filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      (subscriber) => {
        console.log(response);
        const servers = response.data.servers ?? [];
        subscriber.next(
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status}`} :
          {
            ...response,
            message: servers
            .filter((server: { status: Status; }) => server.status === status).length > 0
             ? `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP': 'SERVER DOWN'} status`
             : `No server of ${status} found`,
              data: {
                servers : servers.filter((server: { status: Status; }) => server.status === status),
          },
        }
        );
        subscriber.complete();
      })
      .pipe(
    tap(console.log),
    catchError(this.handleError)
   );

   update$ = (server: Server) => <Observable<CustomResponse>> this.http.put<CustomResponse>(`${this.apiUrl}/servers/update`, server)


   private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
        () => new Error('An error occurred - Error code: ${error.status}, Error message: ${error.message}')
      );
  }

   /*getServers(): Observable<CustomResponse>{
    return this.http.get<CustomResponse>('http://localhost:8080/server/list');
   }*/


}
