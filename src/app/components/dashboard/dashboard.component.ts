import { Component } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Dashboard</h1>
      <p class="dashboard-subtitle">Welcome to your application dashboard</p>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3>Total Users</h3>
          <p class="card-value">1,234</p>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h3>Active Projects</h3>
          <p class="card-value">42</p>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h3>Performance</h3>
          <p class="card-value">98%</p>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h3>Revenue</h3>
          <p class="card-value">$45.2K</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: var(--spacing-xl, 2rem);
        animation: fadeIn 0.3s ease-in;
      }

      .dashboard-title {
        font-size: var(--font-size-3xl, 2rem);
        font-weight: var(--font-weight-bold, 700);
        color: var(--color-text-primary, #2d3748);
        margin: 0 0 var(--spacing-sm, 0.5rem) 0;
      }

      .dashboard-subtitle {
        font-size: var(--font-size-lg, 1.125rem);
        color: var(--color-text-secondary, #718096);
        margin: 0 0 var(--spacing-2xl, 3rem) 0;
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg, 1.5rem);
      }

      .dashboard-card {
        background: var(--color-surface, #ffffff);
        border-radius: var(--radius-lg, 0.75rem);
        padding: var(--spacing-xl, 2rem);
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
        transition: var(--transition-base, 300ms cubic-bezier(0.4, 0, 0.2, 1));

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
        }

        h3 {
          font-size: var(--font-size-sm, 0.875rem);
          font-weight: var(--font-weight-semibold, 600);
          color: var(--color-text-secondary, #718096);
          margin: var(--spacing-md, 1rem) 0 var(--spacing-sm, 0.5rem) 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .card-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(
          135deg,
          var(--color-primary, #667eea) 0%,
          var(--color-secondary, #764ba2) 100%
        );
        border-radius: var(--radius-md, 0.5rem);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 24px;
          height: 24px;
          stroke: var(--color-text-on-primary, #ffffff);
        }
      }

      .card-value {
        font-size: var(--font-size-3xl, 2rem);
        font-weight: var(--font-weight-bold, 700);
        color: var(--color-text-primary, #2d3748);
        margin: 0;
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

      @media (max-width: 768px) {
        .dashboard-container {
          padding: var(--spacing-lg, 1.5rem);
        }

        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent {}
