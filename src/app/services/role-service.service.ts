import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../entities/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {

  
  constructor(private _http: HttpClient) { }
  getRolesList(): Observable<Role[]> {
    return this._http.get<Role[]>('https://localhost:7002/api/Position')
  }
}
