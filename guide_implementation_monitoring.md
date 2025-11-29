# Guide d'Implémentation des Outils de Monitoring - Mon Toit

## 1. Configuration Sentry pour Monitoring d'Erreurs

### Installation
```bash
npm install @sentry/react @sentry/tracing
```

### Configuration (src/sentry.js)
```javascript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const SENTRY_DSN = "https://your-sentry-dsn@sentry.io/project-id";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV || "production",
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["localhost", /^https:\/\/somet1010-montoit-st-jcvj\.bolt\.host/],
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(React.useEffect),
    }),
  ],
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filtrer les erreurs non-critiques
    if (event.exception) {
      const error = hint.originalException;
      if (error?.name === 'ChunkLoadError') {
        return null; // Ignorer les erreurs de chargement de chunks
      }
    }
    return event;
  },
});

export default Sentry;
```

### Utilisation dans les Composants (src/components/ErrorBoundary.js)
```javascript
import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    
    this.setState({ errorId });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Une erreur est survenue</h2>
          <p>Notre équipe a été notifiée. Erreur ID: {this.state.errorId}</p>
          <button onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Sentry.withErrorBoundary(ErrorBoundary, {
  fallback: ({ error, resetError }) => (
    <div className="error-boundary-fallback">
      <h3>Erreur de l'application</h3>
      <p>{error.message}</p>
      <button onClick={resetError}>Réessayer</button>
    </div>
  ),
});
```

## 2. Google Analytics 4 - Configuration Complète

### Installation (public/index.html)
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: 'Mon Toit - Plateforme Immobilière',
    page_location: window.location.href,
  });
</script>
```

### Service Analytics (src/services/analytics.js)
```javascript
class AnalyticsService {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (typeof gtag !== 'undefined') {
      this.initialized = true;
      console.log('✅ Google Analytics initialisé');
    }
  }

  // Track des pages vues
  pageView(pageName, pagePath) {
    if (this.initialized) {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageName,
        page_location: `https://somet1010-montoit-st-jcvj.bolt.host${pagePath}`,
      });
    }
  }

  // Track des événements personnalisés
  event(action, category, label = null, value = null) {
    if (this.initialized) {
      const eventData = {
        event_category: category,
        event_action: action,
      };
      
      if (label) eventData.event_label = label;
      if (value) eventData.value = value;
      
      gtag('event', action, eventData);
    }
  }

  // Track spécifique pour les recherches
  trackSearch(searchTerm, resultsCount) {
    this.event('search', 'Property', searchTerm, resultsCount);
    
    // Custom event pour les funnel analytics
    gtag('event', 'property_search', {
      search_term: searchTerm,
      results_count: resultsCount,
      timestamp: Date.now(),
    });
  }

  // Track des conversions
  trackConversion(conversionType, value = null) {
    gtag('event', 'conversion', {
      conversion_type: conversionType,
      value: value,
    });
  }

  // Track des erreurs pour corrélation
  trackError(errorType, errorMessage, page) {
    gtag('event', 'exception', {
      description: `${errorType}: ${errorMessage}`,
      fatal: false,
      page: page,
    });
  }
}

export const analytics = new AnalyticsService();

// Auto-initialisation
analytics.init();
```

### Hook React pour Analytics (src/hooks/useAnalytics.js)
```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../services/analytics';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track des pages vues automatiquement
    analytics.pageView(
      document.title,
      location.pathname + location.search
    );
  }, [location]);

  return {
    event: analytics.event.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
}
```

## 3. LogRocket - Session Replay et Monitoring

### Installation et Configuration (src/logrocket.js)
```javascript
import LogRocket from 'logrocket';

const LOGROCKET_APP_ID = 'your-logrocket-app-id';

LogRocket.init(LOGROCKET_APP_ID, {
  root: 'body',
  release: process.env.REACT_APP_VERSION,
  env: process.env.NODE_ENV,
});

LogRocket.getSessionURL((sessionURL) => {
  console.log('Session LogRocket:', sessionURL);
});

// Configuration privacy
LogRocket.identify('user-id', {
  name: 'User Name',
  email: 'user@example.com',
  
  // Données customisées
  subscription_tier: 'premium',
  user_type: 'proprietaire',
});

// Filtering des données sensibles
LogRocket.registerPrivacySetting({
  // Masquer les mots de passe
  password: true,
  
  // Masquer les emails partiels
  email: (value) => value ? value.substring(0, 3) + '***' : '',
  
  // Custom filtering pour les données de cartes
  card_number: true,
  cvv: true,
});

export default LogRocket;
```

## 4. Service de Logging Structuré (src/services/logger.js)

### Configuration du Logger
```javascript
class StructuredLogger {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.sentryEnabled = true; // Activer Sentry
    this.consoleEnabled = this.environment === 'development';
  }

  // Log avec structure standardisée
  log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
    };

    // Console pour développement
    if (this.consoleEnabled) {
      const consoleMethod = level === 'error' ? 'error' : 'console.log';
      console[consoleMethod]('🔍 [MONTOIT]', logEntry);
    }

    // Sentry pour production
    if (this.sentryEnabled && this.environment === 'production') {
      if (level === 'error') {
        Sentry.captureMessage(message, 'error', { extra: context });
      } else if (level === 'warning') {
        Sentry.captureMessage(message, 'warning', { extra: context });
      }
    }

    // Analytics pour certains événements
    if (level === 'info' && context.analytics) {
      this.trackAnalyticsEvent(context.analytics);
    }
  }

  // Méthodes de convenience
  info(message, context = {}) {
    this.log('info', message, context);
  }

  warn(message, context = {}) {
    this.log('warning', message, context);
  }

  error(message, context = {}) {
    this.log('error', message, context);
  }

  // Log spécifique pour les performances
  performance(operation, duration, context = {}) {
    this.log('info', `Performance: ${operation}`, {
      ...context,
      performance: {
        operation,
        duration: `${duration}ms`,
        timestamp: Date.now(),
      },
      analytics: {
        event: 'performance_metric',
        metric_name: operation,
        metric_value: duration,
      },
    });
  }

  // Log spécifique pour les analytics
  analytics(eventName, eventData = {}) {
    this.log('info', `Analytics: ${eventName}`, {
      analytics: {
        event: eventName,
        ...eventData,
      },
    });
  }

  getSessionId() {
    if (!window.sessionStorage.getItem('montoit_session_id')) {
      window.sessionStorage.setItem('montoit_session_id', 
        'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      );
    }
    return window.sessionStorage.getItem('montoit_session_id');
  }

  trackAnalyticsEvent(analyticsData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', analyticsData.event, analyticsData);
    }
  }
}

export const logger = new StructuredLogger();

// Utilisation dans les composants
export const useLogger = () => ({
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  performance: logger.performance.bind(logger),
  analytics: logger.analytics.bind(logger),
});
```

## 5. Monitoring des Performance Web Vitals

### Service Web Vitals (src/services/webVitals.js)
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class WebVitalsMonitoring {
  constructor() {
    this.metrics = {};
    this.initialize();
  }

  initialize() {
    // Core Web Vitals
    getCLS(this.onMetric.bind(this));
    getFID(this.onMetric.bind(this));
    getFCP(this.onMetric.bind(this));
    getLCP(this.onMetric.bind(this));
    getTTFB(this.onMetric.bind(this));

    // Métriques custom
    this.measureCustomMetrics();
  }

  onMetric(metric) {
    this.metrics[metric.name] = metric;
    
    // Log pour debugging
    console.log(`📊 ${metric.name}:`, {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
    });

    // Envoyer vers analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        metric_name: metric.name,
        metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
      });
    }

    // Envoyer vers Sentry
    if (metric.name === 'CLS' && metric.value > 0.1) {
      Sentry.addBreadcrumb({
        message: `High Cumulative Layout Shift: ${metric.value}`,
        category: 'performance',
        level: 'warning',
      });
    }
  }

  measureCustomMetrics() {
    // Mesurer le temps de chargement de l'application React
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.logCustomMetric('app_load_time', 
          navigation.loadEventEnd - navigation.loadEventStart);
        
        this.logCustomMetric('dom_ready_time',
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        
        this.logCustomMetric('first_paint',
          performance.getEntriesByName('first-paint')[0]?.startTime || 0);
      }, 0);
    });

    // Mesurer les transitions de route React
    this.measureRouteTransitions();
  }

  measureRouteTransitions() {
    // Patch history API pour mesurer les transitions
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      const start = performance.now();
      originalPushState.apply(this, args);
      
      setTimeout(() => {
        const duration = performance.now() - start;
        this.logCustomMetric('route_transition', duration);
      }, 0);
    }.bind(this);

    // Similar pour replaceState
    history.replaceState = function(...args) {
      const start = performance.now();
      originalReplaceState.apply(this, args);
      
      setTimeout(() => {
        const duration = performance.now() - start;
        this.logCustomMetric('route_transition', duration);
      }, 0);
    }.bind(this);
  }

  logCustomMetric(name, value) {
    console.log(`📈 Custom Metric - ${name}:`, value);
    
    // Envoyer vers analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'custom_metric', {
        metric_name: name,
        metric_value: Math.round(value),
      });
    }
  }

  getMetrics() {
    return this.metrics;
  }

  // Rapport détaillé des métriques
  generateReport() {
    return {
      coreWebVitals: this.metrics,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }
}

export const webVitalsMonitoring = new WebVitalsMonitoring();
export default webVitalsMonitoring;
```

## 6. Dashboard de Monitoring Admin

### Page de Monitoring (src/pages/admin/MonitoringDashboard.js)
```javascript
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState({
    errors: [],
    performance: [],
    analytics: [],
  });

  useEffect(() => {
    // Charger les métriques depuis une API ou localStorage
    loadMetrics();
    
    // Refresh automatique toutes les 30 secondes
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      // Simuler le chargement des métriques
      const newMetrics = {
        errors: JSON.parse(localStorage.getItem('error_logs') || '[]'),
        performance: JSON.parse(localStorage.getItem('performance_logs') || '[]'),
        analytics: JSON.parse(localStorage.getItem('analytics_logs') || '[]'),
      };
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
    }
  };

  const performanceData = {
    labels: metrics.performance.slice(-20).map(p => new Date(p.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temps de chargement (ms)',
        data: metrics.performance.slice(-20).map(p => p.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <div className="monitoring-dashboard">
      <h1>Tableau de Bord de Monitoring</h1>
      
      {/* Métriques en temps réel */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Erreurs JavaScript</h3>
          <div className="metric-value">{metrics.errors.length}</div>
          <small>Dernières 24h</small>
        </div>
        
        <div className="metric-card">
          <h3>Temps de chargement moyen</h3>
          <div className="metric-value">
            {metrics.performance.length > 0 
              ? Math.round(metrics.performance.reduce((acc, p) => acc + p.value, 0) / metrics.performance.length)
              : 0}ms
          </div>
          <small>Page actuelle</small>
        </div>
        
        <div className="metric-card">
          <h3>Recherches</h3>
          <div className="metric-value">
            {metrics.analytics.filter(a => a.event === 'search').length}
          </div>
          <small>Dernières 24h</small>
        </div>
      </div>

      {/* Graphique de performance */}
      {metrics.performance.length > 0 && (
        <div className="chart-container">
          <h3>Performance des Pages</h3>
          <Line data={performanceData} options={{ responsive: true }} />
        </div>
      )}

      {/* Liste des erreurs récentes */}
      <div className="errors-list">
        <h3>Erreurs Récentes</h3>
        {metrics.errors.slice(-10).map((error, index) => (
          <div key={index} className="error-item">
            <span className="error-time">
              {new Date(error.timestamp).toLocaleString()}
            </span>
            <span className="error-message">{error.message}</span>
            <span className="error-level">{error.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
```

## 7. Configuration Environment Variables

### .env.production
```bash
# Sentry
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
REACT_APP_SENTRY_ENVIRONMENT=production

# Google Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# LogRocket
REACT_APP_LOGROCKET_APP_ID=your-logrocket-app-id

# APIs
REACT_APP_SUPABASE_URL=https://muiidvzmpcmcmrxuwtqt.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Monitoring
REACT_APP_ENABLE_MONITORING=true
REACT_APP_LOG_LEVEL=info
```

## 8. Scripts de Déploiement

### package.json scripts
```json
{
  "scripts": {
    "build:monitoring": "npm run build && npm run build:analyze",
    "build:analyze": "npm run build -- --analyze",
    "test:monitoring": "npm run test && npm run test:coverage",
    "lint:fix": "npm run lint --fix",
    "monitor:health": "curl -f https://somet1010-montoit-st-jcvj.bolt.host/health || exit 1"
  }
}
```

Cette implémentation complète fournit un système de monitoring robuste avec :
- ✅ Monitoring d'erreurs en temps réel
- ✅ Analytics utilisateur détaillées
- ✅ Performance monitoring
- ✅ Session replay pour debugging
- ✅ Dashboard admin de visualisation
- ✅ Intégration seamless avec l'infrastructure existante

---

**Prochaines étapes** :
1. Installer et configurer les outils un par un
2. Tester en environnement de staging
3. Déployer progressivement en production
4. Monitorer et ajuster les configurations