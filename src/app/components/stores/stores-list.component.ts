import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="stores-page">
      <div class="stores-page__header">
        <div>
          <h1>Stores</h1>
          <p>Manage your stores and their settings</p>
        </div>
        <p-button
          label="Add Store"
          icon="pi pi-plus"
          (onClick)="onAdd()"
          [rounded]="true"
          severity="danger"
        />
      </div>

      <div class="stores-page__empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <h2>No stores yet</h2>
        <p>Create your first store to get started</p>
        <p-button
          label="Create Store"
          icon="pi pi-plus"
          (onClick)="onAdd()"
          severity="danger"
        />
      </div>
    </div>
  `,
  styles: [`
    .stores-page {
      animation: fadeIn 0.3s ease;

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--p-surface-800, #1a202c);
          margin: 0 0 0.25rem;
        }

        p {
          font-size: 0.9rem;
          color: var(--p-surface-500, #718096);
          margin: 0;
        }
      }

      &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: var(--p-surface-0, #fff);
        border-radius: 12px;
        border: 1px solid var(--p-surface-200, #e2e8f0);
        text-align: center;

        svg {
          width: 56px;
          height: 56px;
          color: var(--p-surface-300, #cbd5e0);
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--p-surface-700, #2d3748);
          margin: 0 0 0.5rem;
        }

        p {
          font-size: 0.88rem;
          color: var(--p-surface-400, #a0aec0);
          margin: 0 0 1.25rem;
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class StoresListComponent {
  constructor(private router: Router) {}

  onAdd(): void {
    this.router.navigate(['/stores/add']);
  }
}
