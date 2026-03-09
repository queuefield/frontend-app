import { Component } from '@angular/core';


@Component({
  selector: 'app-general-settings',
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>General Settings</h1>
        <p class="page-description">Configure general application settings</p>
      </div>

      <div class="page-content">
        <div class="placeholder-card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          <h2>General Settings</h2>
          <p>This page will contain general application configuration options and preferences.</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        animation: fadeIn 0.3s ease-in;
      }

      .page-header {
        margin-bottom: var(--spacing-xl, 2rem);

        h1 {
          font-size: var(--font-size-3xl, 2rem);
          font-weight: var(--font-weight-bold, 700);
          color: var(--color-text-primary, #2d3748);
          margin: 0 0 var(--spacing-sm, 0.5rem) 0;
        }
      }

      .page-description {
        font-size: var(--font-size-lg, 1.125rem);
        color: var(--color-text-secondary, #718096);
        margin: 0;
      }

      .page-content {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
      }

      .placeholder-card {
        background: var(--color-surface, #ffffff);
        border-radius: var(--radius-lg, 0.75rem);
        padding: var(--spacing-2xl, 3rem);
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
        text-align: center;
        max-width: 500px;

        svg {
          width: 64px;
          height: 64px;
          stroke: var(--color-primary, #667eea);
          margin-bottom: var(--spacing-lg, 1.5rem);
        }

        h2 {
          font-size: var(--font-size-xl, 1.25rem);
          font-weight: var(--font-weight-semibold, 600);
          color: var(--color-text-primary, #2d3748);
          margin: 0 0 var(--spacing-md, 1rem) 0;
        }

        p {
          font-size: var(--font-size-md, 1rem);
          color: var(--color-text-secondary, #718096);
          margin: 0;
          line-height: 1.6;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class GeneralSettingsComponent {}
