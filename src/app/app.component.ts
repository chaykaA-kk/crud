import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from './employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importer FormsModule ici

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Ajouter FormsModule aux imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  employees: Employee[] = [];
  newEmployee: Employee = { id: 0, name: '', status: '' }; // Initialize with default values
  updateMode: boolean = false;
  selectedEmployee: Employee | null = null;

  constructor(private empService: EmployeeService) {}

  ngOnInit(): void {
    this.empService.getEmployees().subscribe(
      (data: Employee[]) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  // Method to select employee for update
  selectEmployeeForUpdate(employee: Employee): void {
    this.selectedEmployee = { ...employee }; // Create a copy to avoid direct editing
    this.updateMode = true;
    this.newEmployee = { ...employee }; // To pre-fill the form with the selected employee data
  }

  // Reset the update mode
  resetUpdateMode(): void {
    this.updateMode = false;
    this.selectedEmployee = null;
    this.newEmployee = { id: 0, name: '', status: '' }; // Clear the form
  }

  // Create new employee
  createEmployee(): void {
    // Generate ID only if using frontend logic (with Angular).
    this.newEmployee.id = this.generateUniqueId();

    // If using JSON Server, remove the `id` before sending the request
    delete this.newEmployee.id;

    this.empService.createEmployee(this.newEmployee).subscribe(
      (employee: Employee) => {
        this.employees.push(employee); // Add the new employee to the list
        this.resetUpdateMode();
      },
      (error) => {
        console.error('Error creating employee:', error);
      }
    );
  }

  // Update the selected employee
  updateEmployee(employee: Employee): void {
    // Vérifier si l'ID de l'employé est valide avant de faire l'appel API
    if (employee.id !== undefined && employee.id !== null) {
      this.empService.updateEmployee(employee).subscribe(
        (updatedEmployee: Employee) => {
          console.log('Updated Employee:', updatedEmployee);
          // Mettre à jour la liste des employés
          const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
          if (index !== -1) {
            this.employees[index] = updatedEmployee;
          }
          this.resetUpdateMode(); // Réinitialiser le mode de mise à jour
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      console.error('Invalid employee ID for update');
    }
  }
  

  // Delete an employee
  deleteEmployee(id: number): void {
    if (id !== undefined) {
      this.empService.deleteEmployee(id).subscribe(
        () => {
          this.employees = this.employees.filter(employee => employee.id !== id); // Remove from list
        },
        (error) => {
          console.error('Error deleting employee:', error);
        }
      );
    } else {
      console.error('Invalid employee ID');
    }
  }
  

  // Generate a unique ID for new employees (if needed for frontend, not for JSON Server)
  generateUniqueId(): number {
    return this.employees.length > 0 ? Math.max(...this.employees.map(e => e.id || 0)) + 1 : 1;
  }
}

