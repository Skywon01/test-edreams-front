import { Injectable } from '@angular/core';
import { Tache } from '../model/tache/tache.component';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'https://test-edreams-back-7332a18be8ae.herokuapp.com';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })}

  constructor(private http: HttpClient) { }

  /**
   * Récupère les tâches
   */
  getTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/taches`, this.httpOptions);
  }

  /**
   * Récupère une tâche
   * @param id
   */
  getTache(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  /**
   * Crée une tâche
   * @param Tache
   */

  createTache(Tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/taches`, Tache, this.httpOptions);
  }

  /**
   * Met une tâche à jour
   * @param id
   * @param tache
   */
  updateTache(id: number | undefined, tache: Partial<Tache>): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/taches/${id}`, tache, this.httpOptions);
  }

  /**
   * Supprime une tâche
   * @param id
   */
  deleteTache(id: number | undefined): Observable<Tache> {
    return this.http.delete<Tache>(`${this.apiUrl}/taches/${id}`, this.httpOptions);
  }
}
