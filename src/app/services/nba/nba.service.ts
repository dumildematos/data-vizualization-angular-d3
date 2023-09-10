import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NbaService {

  constructor(private http: HttpClient) { }


  allPlayersBySeason(season: number): Observable<any> {
    return this.http.get(`https://nba-stats-db.herokuapp.com/api/playerdata/season/${season}`)
    .pipe(
      map((response: any) => {
        response.results.forEach((player: any, i: number) => {
          player.two_percent = Number(player.two_percent)
          player.field_percent = Number(player.field_percent)
        });
        return response
      })
    )
  }


}
