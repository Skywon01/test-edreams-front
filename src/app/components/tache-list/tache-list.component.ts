import {Component, OnInit, Output} from '@angular/core';
import {Tache} from "../../model/tache/tache.component";
import {TacheService} from "../../services/tache.service";
import {NgClass} from "@angular/common";
import {NzCardComponent} from "ng-zorro-antd/card";
import {of} from "rxjs";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tache-list',
  standalone: true,
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzPopoverDirective,
    NgClass
  ],
  templateUrl: './tache-list.component.html',
  styleUrl: './tache-list.component.css'
})
export class TacheListComponent implements OnInit {
  @Output() editRequested: EventEmitter<Tache> = new EventEmitter<Tache>();
taches: Tache[] =  [];
constructor(private tacheService: TacheService) { }
  ngOnInit(): void {
    this.tacheService.getTaches().subscribe({
      next: (data) => (this.taches = data),
      error: (err) => console.error(err),
    });
  }

  protected readonly of = of;

  //Suppression d'une tâche
  deleteTache(id: number | undefined): void {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');
    if (confirmation) {
      this.tacheService.deleteTache(id).subscribe({
        next: () => {
          this.taches = this.taches.filter(tache => tache.id !== id);
          console.log(`Tâche avec l'ID ${id} supprimée avec succès.`);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la tâche :', err);
          alert('Une erreur est survenue lors de la suppression.');
        }
      });
    }
  }

  //Edite une tâche
  editTache(tache: Tache): void {
    this.editRequested.emit(tache);
  }

  //Met à jour le CSS pour la couleur de la tâche
  getStatusClass(tache: Tache): string {
    switch (tache.statut) {
      case 'fait':
        return 'status-fait';
      case 'en cours':
        return 'status-en-cours';
      case 'à faire':
        return 'status-a-faire';
      default:
        return '';
    }
  }
}
