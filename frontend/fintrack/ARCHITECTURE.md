# Frontend Architecture

## Folder Structure

```
src/
├── api/                    # API layer
│   └── api.js             # API client and endpoints
├── context/               # React contexts
│   └── AuthContext.jsx   # Authentication context
├── features/              # Feature-based organization
│   ├── auth/             # Authentication feature
│   │   ├── Login.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── index.js
│   ├── dashboard/        # Dashboard feature
│   │   ├── Dashboard.jsx
│   │   ├── UserPortfolios.jsx
│   │   ├── PortfolioChart.jsx
│   │   ├── TopAssets.jsx
│   │   ├── RecentTransactions.jsx
│   │   ├── PortfolioPerformance.jsx
│   │   ├── PortfolioPerformanceChart.jsx
│   │   ├── DashboardCard.jsx
│   │   └── index.js
│   ├── portfolio/        # Portfolio feature
│   │   ├── Portfolios.jsx
│   │   ├── PortfolioDetail.jsx
│   │   └── index.js
│   └── transactions/     # Transactions feature
│       ├── NewTransaction.jsx
│       ├── SearchAssetInput.jsx
│       └── index.js
├── router/               # Application routing
│   └── index.jsx
├── shared/               # Shared components and utilities
│   ├── components/       # Shared components
│   │   ├── DashboardLayout.jsx
│   │   ├── MobileMenu.jsx
│   │   └── index.js
│   └── ui/              # UI components library
│       ├── badge.jsx
│       ├── button.jsx
│       ├── calendar.jsx
│       ├── card.jsx
│       ├── chart.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── popover.jsx
│       ├── select.jsx
│       ├── sheet.jsx
│       ├── sonner.jsx
│       └── index.js
├── utils/                # Utility functions
│   ├── constants.js      # Application constants
│   ├── utils.js          # Utility functions
│   └── index.js
├── App.jsx               # Main App component
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## Key Improvements

### 1. Feature-Based Architecture
- Organized components by feature rather than by type
- Each feature has its own folder with related components
- Clean separation of concerns

### 2. Improved Import System
- Created index.js files for cleaner imports
- Updated all import paths to use new structure
- Consistent @/ alias usage

### 3. Better API Layer
- Centralized API client with error handling
- Constants for configuration
- Reusable API methods

### 4. Context Management
- AuthContext for authentication state
- Proper error handling and loading states

### 5. Shared Components
- UI components in shared/ui
- Layout components in shared/components
- Better reusability

### 6. Constants and Configuration
- Environment variables support
- Application constants centralized
- Route definitions

## Import Patterns

### Feature Imports
```jsx
import { Login, ProtectedRoute } from '@/features/auth';
import { Dashboard } from '@/features/dashboard';
```

### UI Component Imports
```jsx
import { Button, Card, Input } from '@/shared/ui';
```

### API Imports
```jsx
import { getCurrentUser, apiGet, apiPost } from '@/api/api';
```

### Utils Imports
```jsx
import { API_BASE_URL, ROUTES } from '@/utils/constants';
import { cn } from '@/utils/utils';
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Notes

- All components use consistent naming conventions
- Import paths are clean and maintainable
- Architecture supports easy scaling
- JavaScript-based with clean architecture patterns