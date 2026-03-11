import { Component } from '@angular/core';

@Component({
  selector: 'app-branches-list',
  standalone: true,
  imports: [],
  template: `
    <div class="branches-page">
      <div class="branches-page__header">
        <h1>Branches</h1>
        <p>Manage store branches and locations</p>
      </div>
      <div class="branches-page__empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <h2>Branches</h2>
        <p>Branches are managed within each store. Go to Stores to add or edit branches.</p>
      </div>
    </div>
  `,
  styles: [`
    .branches-page {
      animation: fadeIn 0.3s ease;

      &__header {
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
          margin: 0;
          max-width: 320px;
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class BranchesListComponent {}
