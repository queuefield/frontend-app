import { Component } from '@angular/core';


@Component({
  selector: 'app-security-settings',
  imports: [],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Security Settings</h1>
        <p class="page-description">Manage security and authentication settings</p>
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h2>Security Settings</h2>
          <p>
            This page will contain security configurations, password policies, and authentication
            settings.
          </p>
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
export class SecuritySettingsComponent {}
