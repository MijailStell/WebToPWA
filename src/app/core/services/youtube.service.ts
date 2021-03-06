import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService extends BaseService {

  /**
   * Constructor
   * @param httpClient Instancia para invocación a servicios
   */
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getVideos(searchText: string): Observable<any> {
    const urlSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText}&maxResults=12&key=${environment.apiKey}`;
    return this.httpClient.get<any>(urlSearch);
  }
}
