import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 0. Theme Variables
import './styles/theme.css';

// 1. Global Styles (incluyendo reseteos y tipografía)
import './styles/global.css';

// 2. Estilos de Componentes (botones, tarjetas, formularios, etc.)
import './styles/components/buttons.css';
import './styles/components/cards.css';
import './styles/components/forms.css';
import './styles/components/tables.css';
import './styles/components/modals.css';
import './styles/components/badges.css';
import './styles/components/stats.css';
import './styles/components/auth.css';
import './styles/components/filters.css';

// 3. Estilos de Layout (header, sidebar, etc.)
import './styles/components/header.css';
import './styles/components/sidebar.css';

// 4. Estilos de Gráficos
import './styles/charts.css';

// 5. Estilos de Páginas Específicas
import './styles/pages/admin-profile.css';

// Componente Principal de la Aplicación
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
