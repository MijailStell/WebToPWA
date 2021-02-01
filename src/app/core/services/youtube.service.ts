import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService extends BaseService {

  /**
   * Constructor
   * @param httpClient Instancia para invocación a servicios
   * @param environmentService Instancia para invocación el uri dependiendo del ambiente
   * @param router Instancia para manejo de rutas
   */
  constructor(
    protected httpClient: HttpClient,
    private environmentService: EnvironmentService) {
    super(httpClient);
  }

  getVideos(searchText: string): Observable<any> {
    const urlSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText}&maxResults=12&key=AIzaSyArH-JU-dtgamU1QKrn4STcnsOzmzhUzBo`;
    return this.httpClient.get<any>(urlSearch);
  }
}
