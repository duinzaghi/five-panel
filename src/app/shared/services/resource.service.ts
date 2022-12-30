import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResourceDataService {
    apiUrl = environment.apiUrl + '/resources';

    constructor(private httpClient: HttpClient) {
    }

    getAll(){
        return this.httpClient.get<any>(this.apiUrl).pipe (
            map( response => {
                return response.data;
            }),
        );
    }
}
