import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {
  apiUrl = environment.apiUrl + '/employees';

  constructor(private httpClient: HttpClient) {
  }

  getAll(){
    return this.httpClient.get<any>(this.apiUrl).pipe (
        map( response => {
            response.data.forEach((item: { ID: any; id: any; }) => {
               item.ID = item.id;
            });
          return response.data;
        }),
    );
  }
}

