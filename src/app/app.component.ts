import {Component, OnInit} from '@angular/core';
import {TacheListComponent} from "./components/tache-list/tache-list.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NgIf} from "@angular/common";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {TacheService} from "./services/tache.service";
import {Tache} from "./model/tache/tache.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TacheListComponent, ReactiveFormsModule, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent, NzInputDirective, NgIf, NzSelectComponent, NzOptionComponent, NzButtonComponent, NzFormDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'test-edreams-front';
  taches: Tache[] = [];
  taskForm: FormGroup;
  add_task: boolean = false;
  selectedTask: Tache | null = null;

  constructor(private fb: FormBuilder, private tacheService: TacheService) {
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      statut: ['TODO', Validators.required],
    });
  }

  ngOnInit() {
    this.loadTaches();
  }

  /**
   * Charge les tâches
   */
  loadTaches(): void {
    this.tacheService.getTaches().subscribe({
      next: (data) => (this.taches = data),
      error: (err) => console.error('Erreur lors du chargement des tâches :', err),
    });
  }

  /**
   * Formulaire d'ajout ou de modification d'une tâche
   */
  submitForm(): void {
    if (this.taskForm.valid) {
      if (this.selectedTask) {
        // Mode modification
        this.tacheService.updateTache(this.selectedTask.id, this.taskForm.value).subscribe({
          next: (response) => {
            console.log('Tâche mise à jour avec succès :', response);
            alert('Tâche mise à jour !');
            // Mets à jour la tâche modifiée dans la liste
            this.taches = this.taches.map(tache =>
              tache.id === response.id ? response : tache
            );
            this.resetForm();
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de la tâche :', err);
            alert('Une erreur est survenue lors de la mise à jour.');
          }
        });
      } else {
        // Mode ajout
        this.tacheService.createTache(this.taskForm.value).subscribe({
          next: (response) => {
            console.log('Tâche ajoutée avec succès :', response);
            alert('Tâche ajoutée !');
            // Ajoute directement la tâche à la liste
            this.taches.push(response);
            this.resetForm();
          },
          error: (err) => {
            console.error('Erreur lors de l\'ajout de la tâche :', err);
            alert('Une erreur est survenue.');
          }
        });
      }
    } else {
      console.log('Le formulaire est invalide.');
    }
  }


  resetForm(): void {
    // Réinitialise le formulaire
    this.taskForm.reset({ statut: 'TODO' });
    // Sort du mode modification
    this.selectedTask = null;
    // Cache le formulaire
    this.add_task = false;
  }

  onEditRequested(tache: Tache): void {
    // Stocke la tâche sélectionnée
    this.selectedTask = tache;
    // Pré-remplit le formulaire
    this.taskForm.patchValue({
      titre: tache.titre,
      description: tache.description,
      statut: tache.statut
    });
    this.add_task = true; // Affiche le formulaire
  }

}
