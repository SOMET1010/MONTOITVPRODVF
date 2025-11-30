# 🚨 CORRECTIONS CRITIQUES À APPLIQUER IMMÉDIATEMENT

## 📋 CHECKLIST DE CORRECTIONS

### 🔴 PHASE 1 - DASHBOARDS (Critique)

#### ✅ 1.1 DashboardPage.tsx
```bash
Fichiers à modifier:
- /src/features/dashboard/pages/DashboardPage.tsx
```

**Corrections à appliquer:**

```typescript
// AVANT (Ligne ~346)
<p className="text-2xl font-bold text-neutral-900">{stats?.unreadNotifications || 0}</p>

// APRÈS (Sécurisé)
<p className="text-2xl font-bold text-neutral-900">{stats?.unreadNotifications ?? 0}</p>

// AVANT (Lignes ~367, 415, 456)
{visits.length > 0 ? visits.map((visit) => (

// APRÈS (Avec validation)
{Array.isArray(visits) && visits.length > 0 ? visits.map((visit) => (

// AVANT (Ligne ~113-120)
if (profileResult.data) {
  await Promise.all([
    loadVisits(profileResult.data.id),
    loadApplications(profileResult.data.id),
    loadRecommendations(),
  ]);
}

// APRÈS (Avec gestion d'erreur)
if (profileResult.data) {
  try {
    await Promise.all([
      loadVisits(profileResult.data.id),
      loadApplications(profileResult.data.id), 
      loadRecommendations(),
    ]);
  } catch (error) {
    console.error('Erreur chargement données supplémentaires:', error);
    // Graceful degradation - continue sans ces données
  }
}
```

#### ✅ 1.2 DashboardStats.tsx
```typescript
// AVANT (Ligne 10)
interface DashboardStatsProps {
  stats: DashboardStats;
}

// APRÈS (Avec validation)
interface DashboardStatsProps {
  stats?: DashboardStats | null;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  // AJOUTER en début de fonction
  if (!stats) {
    return (
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-neutral-500">
            Chargement des statistiques...
          </div>
        </div>
      </div>
    );
  }

  // Sécuriser toutes les valeurs
  const statCards = [
    {
      label: 'Favoris',
      value: stats.totalFavorites || 0,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Recherches', 
      value: stats.totalSearches || 0,
      icon: Search,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Alertes Actives',
      value: stats.totalAlerts || 0,
      icon: Bell,
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'Notifications',
      value: stats.unreadNotifications || 0,
      icon: Clock,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];
```

---

### 🤖 PHASE 2 - SERVICES IA (Critique)

#### ✅ 2.1 recommendationService.ts
```typescript
// Fichier: /src/services/ai/recommendationService.ts

// AJOUTER après ligne 19
interface RecommendationScore {
  propertyId: string;
  score: number;
  reason: string;
  algorithm: string;
}

// REMPLACER la méthode calculateRecommendationScores (ligne 134)
private static async calculateRecommendationScores(
  userId: string,
  activity: any[],
  favorites: string[]
): Promise<RecommendationScore[]> {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'disponible')
      .limit(100);

    if (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      return [];
    }

    if (!properties || properties.length === 0) {
      console.warn('Aucune propriété disponible trouvée');
      return [];
    }

    const scores: RecommendationScore[] = [];

    for (const property of properties) {
      // Validation des données de propriété
      if (!property.id || !property.city || !property.property_type) {
        continue; // Skip les propriétés incomplètes
      }

      let score = 0;
      const reasons: string[] = [];

      if (favorites.includes(property.id)) {
        score += 40;
        reasons.push('Similaire à vos favoris');
      }

      // Traitement sécurisé de l'activité
      const viewedProperties = activity
        .filter((a) => a.action_type === 'view' && a.property_id)
        .map((a) => a.property_id);

      const viewedCities = activity
        .filter((a) => a.action_type === 'view' && a.action_data?.city)
        .map((a) => a.action_data.city)
        .filter((city): city is string => Boolean(city));

      if (viewedCities.includes(property.city)) {
        score += 25;
        reasons.push(`Ville préférée: ${property.city}`);
      }

      // Traitement sécurisé des recherches
      const searchActivity = activity.filter((a) => a.action_type === 'search');
      if (searchActivity.length > 0 && searchActivity[0].action_data) {
        const lastSearch = searchActivity[0];
        const criteria = lastSearch.action_data || {};

        if (criteria.property_type && property.property_type === criteria.property_type) {
          score += 20;
          reasons.push('Correspond à votre recherche');
        }

        if (criteria.min_price && criteria.max_price && property.monthly_rent) {
          const inRange = property.monthly_rent >= criteria.min_price && 
                         property.monthly_rent <= criteria.max_price;
          if (inRange) {
            score += 15;
            reasons.push('Dans votre budget');
          }
        }
      }

      // Score de popularité sécurisé
      const viewCount = property.view_count || 0;
      const popularityScore = Math.min(viewCount * 0.1, 20);
      score += popularityScore;
      if (popularityScore > 10) {
        reasons.push('Populaire auprès des locataires');
      }

      // Score de fraîcheur sécurisé
      if (property.created_at) {
        const daysOld = Math.floor(
          (Date.now() - new Date(property.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const freshnessScore = Math.max(10 - daysOld, 0);
        score += freshnessScore;
        if (freshnessScore > 5) {
          reasons.push('Annonce récente');
        }
      }

      if (score > 0) {
        scores.push({
          propertyId: property.id,
          score: Math.min(score, 100),
          reason: reasons.join(', '),
          algorithm: 'hybrid',
        });
      }
    }

    return scores;
  } catch (error) {
    console.error('Erreur lors du calcul des scores de recommandation:', error);
    return [];
  }
}
```

#### ✅ 2.2 chatbotService.ts
```typescript
// Fichier: /src/services/chatbotService.ts

// REMPLACER la méthode getAIResponse (ligne 133)
async getAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userId: string | null = null
): Promise<string> {
  try {
    const systemPrompt = `Tu es SUTA, l'assistant virtuel PROTECTEUR de Mon Toit...`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chatbot`;

    // Ajout d'un timeout et gestion d'erreur robuste
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages,
          userId,
          temperature: 0.8,
          maxTokens: 1000,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Fallback sur le status text
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        
        console.error('Edge function error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Validation de la réponse
      if (!data || typeof data !== 'object') {
        throw new Error('Réponse invalide du service AI');
      }
      
      if (!data.content || typeof data.content !== 'string') {
        throw new Error('Contenu de réponse manquant ou invalide');
      }

      console.log('✅ AI Response received successfully from edge function');
      return data.content;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('❌ Error getting AI response:', error);
    console.log('🔄 Using intelligent fallback system');
    
    // Logger le contexte pour debugging
    console.log('Context:', { 
      userMessage: userMessage?.substring(0, 100), 
      historyLength: conversationHistory.length, 
      userId: userId ? 'present' : 'null',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return this.getFallbackResponse(userMessage);
  }
}
```

---

### 📝 PHASE 3 - CONTRATS (Critique)

#### ✅ 3.1 contractService.ts
```typescript
// Fichier: /src/services/contractService.ts

// REMPLACER la méthode generateAndSaveContract (ligne 29)
async generateAndSaveContract(leaseId: string): Promise<string> {
  if (!leaseId || leaseId.trim() === '') {
    throw new Error('ID de bail requis pour générer le contrat');
  }

  try {
    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .select(`
        *,
        property:properties(title, address, city),
        landlord:profiles!leases_landlord_id_fkey(full_name, phone, email),
        tenant:profiles!leases_tenant_id_fkey(full_name, phone, email)
      `)
      .eq('id', leaseId)
      .single();

    if (leaseError) {
      console.error('Erreur base de données:', leaseError);
      throw new Error(`Erreur lors de la récupération du bail: ${leaseError.message}`);
    }
    
    if (!lease) {
      throw new Error(`Bail introuvable pour l'ID: ${leaseId}`);
    }

    // Validation stricte des données critiques
    const validationErrors: string[] = [];
    
    if (!lease.property?.title) {
      validationErrors.push('Titre de propriété manquant');
    }
    
    if (!lease.property?.address) {
      validationErrors.push('Adresse de propriété manquante');
    }
    
    if (!lease.landlord?.full_name) {
      validationErrors.push('Nom du propriétaire manquant');
    }
    
    if (!lease.tenant?.full_name) {
      validationErrors.push('Nom du locataire manquant');
    }
    
    if (!lease.monthly_rent || lease.monthly_rent <= 0) {
      validationErrors.push('Loyer mensuel invalide (doit être > 0)');
    }
    
    if (!lease.start_date) {
      validationErrors.push('Date de début manquante');
    }
    
    if (!lease.end_date) {
      validationErrors.push('Date de fin manquante');
    }

    if (validationErrors.length > 0) {
      throw new Error(`Données incomplètes pour la génération du contrat: ${validationErrors.join(', ')}`);
    }

    // Validation des dates
    const startDate = new Date(lease.start_date);
    const endDate = new Date(lease.end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Format de date invalide dans le bail');
    }
    
    if (endDate <= startDate) {
      throw new Error('La date de fin doit être postérieure à la date de début');
    }

    const contractData: ContractData = {
      leaseId,
      propertyTitle: lease.property.title,
      propertyAddress: lease.property.address,
      propertyCity: lease.property.city || '',
      landlordName: lease.landlord.full_name,
      landlordPhone: lease.landlord.phone || '',
      landlordEmail: lease.landlord.email || '',
      tenantName: lease.tenant.full_name,
      tenantPhone: lease.tenant.phone || '',
      tenantEmail: lease.tenant.email ||,
      monthlyRent: lease.monthly_rent,
      depositAmount: lease.deposit_amount || 0,
      chargesAmount: lease.charges_amount || 0,
      startDate: lease.start_date,
      endDate: lease.end_date,
      paymentDay: lease.payment_day || 1,
      customClauses: lease.custom_clauses || undefined
    };

    try {
      const pdfBlob = await this.generateContract(contractData);
      
      if (!pdfBlob || !(pdfBlob instanceof Blob)) {
        throw new Error('Échec de la génération du PDF');
      }

      const contractUrl = await this.saveContract(leaseId, pdfBlob);
      
      if (!contractUrl) {
        throw new Error('Échec de la sauvegarde du contrat');
      }

      // Mise à jour de l'URL du contrat en base
      const { error: updateError } = await supabase
        .from('leases')
        .update({ 
          pdf_document_url: contractUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', leaseId);

      if (updateError) {
        console.warn('Erreur lors de la mise à jour de l\'URL du contrat:', updateError);
        // Continue car le contrat a été généré avec succès
      }

      return contractUrl;
      
    } catch (generationError) {
      console.error('Erreur lors de la génération/sauvegarde du contrat:', generationError);
      throw new Error(`Échec de la génération du contrat: ${generationError instanceof Error ? generationError.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur dans generateAndSaveContract:', error);
    throw error; // Re-throw pour que l'appelant puisse gérer
  }
}
```

#### ✅ 3.2 signatureService.ts
```typescript
// Fichier: /src/services/signatureService.ts

// AJOUTER au début du fichier
const REQUEST_TIMEOUT = 30000; // 30 secondes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// REMPLACER les méthodes de requête

private async makeSecureRequest(url: string, body: any, retries = 0): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Si on ne peut pas parser l'erreur JSON, on garde le message par défaut
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Validation de base de la réponse
    if (!result || typeof result !== 'object') {
      throw new Error('Réponse invalide du service');
    }
    
    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry sur erreurs réseau et timeouts
    const isRetryable = error.name === 'AbortError' || 
                       (error instanceof Error && error.message.includes('fetch'));
    
    if (retries < MAX_RETRIES && isRetryable) {
      console.log(`Tentative ${retries + 1} échouée, retry dans ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return this.makeSecureRequest(url, body, retries + 1);
    }
    
    throw error;
  }
}

// REMPLACER les méthodes publiques
async requestCertificate(data: CertificateRequest) {
  try {
    const result = await this.makeSecureRequest(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cryptoneo-signature`,
      {
        action: 'request_certificate',
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber
      }
    );
    
    // Validation de la réponse
    if (!result.certificateId && !result.success) {
      throw new Error('Réponse invalide: certificateId manquant');
    }
    
    return result;
  } catch (error) {
    console.error('Erreur lors de la demande de certificat:', error);
    throw error instanceof Error ? error : new Error('Erreur lors de la demande de certificat');
  }
}
```

---

### 📄 PHASE 4 - CANDIDATURES (Critique)

#### ✅ 4.1 applicationService.ts
```typescript
// Fichier: /src/services/applicationService.ts

// REMPLACER la méthode createApplication (ligne 33)
export async function createApplication(
  propertyId: string,
  applicantId: string,
  formData: ApplicationFormData
): Promise<CreateApplicationResponse> {
  try {
    // Vérification de l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== applicantId) {
      return {
        error: {
          message: 'Authentification invalide',
          details: 'Vous devez être connecté pour créer une candidature'
        },
      };
    }

    // Validation des paramètres
    if (!propertyId || propertyId.trim() === '') {
      return {
        error: {
          message: 'Propriété invalide',
          details: 'ID de propriété requis'
        }
      };
    }

    // Validation des données du formulaire
    const validationErrors = validateApplicationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        error: {
          message: 'Données invalides',
          details: validationErrors,
        },
      };
    }

    // Vérification de l'existence de la propriété
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, status, title')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      console.error('Erreur lors de la vérification de la propriété:', propertyError);
      return {
        error: {
          message: 'Propriété introuvable',
          details: 'Impossible de vérifier la propriété spécifiée'
        }
      };
    }

    if (!property) {
      return {
        error: {
          message: 'Propriété introuvable',
          details: 'La propriété spécifiée n\'existe pas'
        }
      };
    }

    if (property.status !== 'disponible') {
      return {
        error: {
          message: 'Propriété non disponible',
          details: 'Cette propriété n\'accepte plus de candidatures'
        }
      };
    }

    // Vérification de l'existence du profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', applicantId)
      .single();

    if (profileError || !profile) {
      return {
        error: {
          message: 'Profil invalide',
          details: 'Votre profil utilisateur est incomplet'
        }
      };
    }

    // Vérifier s'il n'y a pas déjà une candidature en cours
    const { data: existingApp, error: checkError } = await supabase
      .from('applications')
      .select('id, status')
      .eq('property_id', propertyId)
      .eq('applicant_id', applicantId)
      .in('status', ['en_attente', 'en_cours'])
      .maybeSingle();

    if (checkError) {
      console.warn('Erreur lors de la vérification des candidatures existantes:', checkError);
    }

    if (existingApp) {
      return {
        error: {
          message: 'Candidature existante',
          details: 'Vous avez déjà une candidature en cours pour cette propriété'
        }
      };
    }

    // Préparer les données de l'application avec validation
    const applicationData = {
      property_id: propertyId,
      applicant_id: applicantId,
      status: 'en_attente' as ApplicationStatus,
      current_step: 'informations_personnelles' as ApplicationStep,
      steps: ['informations_personnelles'],
      metadata: {
        personalInfo: formData.personalInfo,
        financialInfo: formData.financialInfo,
        guarantees: formData.guarantees,
        acceptedTerms: formData.acceptTerms || false,
        acceptedPrivacy: formData.acceptPrivacy || false,
        submittedFrom: 'web' as const,
        priority: 'normale' as const,
        validationErrors: [],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Transaction pour créer l'application de manière atomique
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        property:properties(title, address, price),
        applicant:profiles(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'application:', error);
      return {
        error: {
          message: 'Erreur lors de la création de la candidature',
          details: error.message,
        },
      };
    }

    if (!data) {
      return {
        error: {
          message: 'Échec de la création',
          details: 'Aucune donnée retournée après la création'
        }
      };
    }

    // Traiter les documents uploadés si présents
    if (formData.documents && formData.documents.length > 0) {
      try {
        const uploadResults = await uploadDocuments(data.id, formData.documents);
        const failedUploads = uploadResults.filter(result => result.error);
        
        if (failedUploads.length > 0) {
          console.warn(`${failedUploads.length} documents n'ont pas pu être uploadés`);
          // Continue même si certains documents ont échoué
        }
      } catch (uploadError) {
        console.error('Erreur lors de l\'upload des documents:', uploadError);
        // Continue sans les documents pour éviter de bloquer l'application
      }
    }

    // Calculer le score initial
    try {
      const application = mapFromDatabase(data);
      const score = calculateApplicationScore(application);
      
      await updateApplicationScore(data.id, score);
    } catch (scoreError) {
      console.warn('Erreur lors du calcul du score initial:', scoreError);
      // Continue sans score, il sera calculé plus tard
    }

    // Envoyer notification (non-bloquant)
    try {
      await sendApplicationNotification(data.id, 'application_created');
    } catch (notificationError) {
      console.warn('Erreur lors de l\'envoi de notification:', notificationError);
      // Continue sans notification
    }

    // Retourner l'application créée
    const application = mapFromDatabase(data);
    return { data: application };

  } catch (error) {
    console.error('Erreur inattendue lors de la création de l\'application:', error);
    return {
      error: {
        message: 'Erreur lors de la création de la candidature',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
    };
  }
}
```

---

## ⚡ ACTIONS À EXÉCUTER

### Phase 1 - Immédiat (dans l'heure)
1. ✅ Appliquer les corrections DashboardStats.tsx (null checks)
2. ✅ Sécuriser DashboardPage.tsx (validation des arrays)
3. ✅ Corriger recommendationService.ts (types stricts)

### Phase 2 - Aujourd'hui
1. ✅ Implémenter les timeouts dans chatbotService.ts
2. ✅ Sécuriser contractService.ts (validation stricte)
3. ✅ Ajouter retry mechanism dans signatureService.ts

### Phase 3 - Cette semaine
1. ✅ Refactorer applicationService.ts (transaction safety)
2. ✅ Corriger ApplicationForm.tsx (memory leaks)
3. ✅ Sécuriser ApplicationStatus.tsx (CSS fallbacks)

### Test de Validation

Après chaque correction, exécuter ces vérifications:

```bash
# 1. Vérifier la compilation TypeScript
npm run type-check

# 2. Tests unitaires
npm test

# 3. Tests d'intégration
npm run test:e2e

# 4. Linter
npm run lint

# 5. Build de production
npm run build
```

### Monitoring Post-Correction

Ajouter le monitoring suivant:

```typescript
// Dans chaque service critique
try {
  const result = await criticalOperation();
  
  // Log succès
  console.log(`✅ ${operationName} réussi en ${duration}ms`);
  
  return result;
} catch (error) {
  // Log erreur avec contexte
  console.error(`❌ ${operationName} échoué:`, {
    error: error.message,
    context: { userId, propertyId, duration }
  });
  
  throw error;
}
```

**Status: PRÊT POUR IMPLÉMENTATION**
