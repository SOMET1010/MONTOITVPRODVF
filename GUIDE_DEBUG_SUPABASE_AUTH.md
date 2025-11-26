# Guide de Débogage : Erreurs Authentification Supabase

## 🚨 Diagnostic Rapide des Erreurs HTTP 500

### Checklist de Diagnostic Immédiat

#### ✅ **Étape 1 : Vérification de Base**
```bash
# Vérifier la connectivité à Supabase
curl -I "https://tayhmawgohcocfnfhaku.supabase.co/rest/v1/"

# Tester l'API d'authentification
curl -X POST "https://tayhmawgohcocfnfhaku.supabase.co/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'
```

#### ✅ **Étape 2 : Vérification des Logs Supabase**
1. Aller dans le dashboard Supabase → **Logs**
2. Filtrer par **Auth** et **Error**
3. Rechercher les erreurs récentes `Database error saving new user`
4. Noter les codes d'erreur spécifiques

#### ✅ **Étape 3 : Vérification de la Base de Données**

```sql
-- Dans l'éditeur SQL Supabase, exécuter:
SELECT 
  'Tables auth' as check_type,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'auth'

UNION ALL

SELECT 
  'Table profiles' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN 1 ELSE 0 END as count

UNION ALL

SELECT 
  'Triggers auth' as check_type,
  COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

---

## 🔍 Erreurs Communes et Solutions

### 1. **Erreur : `relation "public.profiles" does not exist`**

**Cause :** La table `profiles` n'existe pas.

**Solution :**
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    verification_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. **Erreur : `new row violates row-level security policy`**

**Cause :** Politiques RLS trop restrictives.

**Solution :**
```sql
-- Temporairement désactiver RLS pour tester
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Ou créer une politique plus permissive
CREATE POLICY "Enable all for authenticated users" ON public.profiles
    FOR ALL USING (auth.role() = 'authenticated');
```

### 3. **Erreur : `null value in column "id" violates not-null constraint`**

**Cause :** Le trigger ne reçoit pas l'ID utilisateur.

**Solution :**
```sql
-- Vérifier et recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NOW(),
        NOW()
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur création profil: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4. **Erreur : `duplicate key value violates unique constraint`**

**Cause :** Tentative d'insertion d'un profil existant.

**Solution :**
```sql
-- Vérifier les doublons
SELECT id, COUNT(*) 
FROM public.profiles 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Nettoyer les doublons
DELETE FROM public.profiles 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
            PARTITION BY id ORDER BY created_at
        ) as row_num
        FROM public.profiles
    ) t WHERE row_num > 1
);
```

---

## 🛠️ Scripts de Diagnostic Avancé

### Script de Diagnostic Complet

```sql
-- ========================================
-- DIAGNOSTIC COMPLET DU SYSTÈME D'AUTHENTIFICATION
-- ========================================

-- 1. État des tables d'authentification
SELECT 
    'Tables système' as categorie,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema IN ('auth', 'public', 'storage')
ORDER BY table_schema, table_name;

-- 2. Utilisateurs récents avec profils manquants
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data->>'full_name' as nom,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Profil existe'
        ELSE '❌ Profil manquant'
    END as status_profil
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY u.created_at DESC;

-- 3. Contraintes problématiques
SELECT 
    conname as contrainte,
    contype as type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid IN (
    'auth.users'::regclass,
    'public.profiles'::regclass
)
ORDER BY conname;

-- 4. Politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 5. Logs d'erreur récents
SELECT 
    created_at,
    action,
    payload->>'error' as erreur,
    ip_address
FROM auth.audit_log_entries
WHERE created_at >= NOW() - INTERVAL '1 hour'
    AND action LIKE '%signup%'
ORDER BY created_at DESC
LIMIT 20;

-- 6. Statistiques de performance
SELECT 
    'Inscriptions dernière heure' as metrique,
    COUNT(*) as valeur
FROM auth.users
WHERE created_at >= NOW() - INTERVAL '1 hour'

UNION ALL

SELECT 
    'Tentatives d\'authentification dernière heure' as metrique,
    COUNT(*) as valeur
FROM auth.audit_log_entries
WHERE created_at >= NOW() - INTERVAL '1 hour'
    AND action LIKE '%signin%'

UNION ALL

SELECT 
    'Erreurs dernières 24h' as metrique,
    COUNT(*) as valeur
FROM auth.audit_log_entries
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND action LIKE '%error%';
```

---

## 🔧 Correction des Problèmes de Validation Frontend

### 1. **Messages d'Erreur en Anglais**

**Problème :** Messages HTML5 par défaut en anglais.

**Solution :** Validation JavaScript personnalisée

```typescript
// utils/validation.ts
export const frenchValidationMessages = {
  email: {
    required: 'L\'adresse email est obligatoire',
    invalid: 'L\'adresse email doit être valide (ex: utilisateur@domaine.com)',
    format: 'L\'adresse email doit contenir @ et un domaine valide'
  },
  phone: {
    required: 'Le numéro de téléphone est obligatoire',
    invalid: 'Numéro invalide. Format: +225 XX XX XX XX XX',
    length: 'Le numéro doit contenir 10 chiffres'
  },
  password: {
    required: 'Le mot de passe est obligatoire',
    weak: 'Mot de passe faible. Utilisez au moins 8 caractères avec majuscules, minuscules, chiffres et symboles',
    mismatch: 'Les mots de passe ne correspondent pas'
  },
  name: {
    required: 'Le nom est obligatoire',
    minLength: 'Le nom doit contenir au moins 2 caractères'
  }
};

export const validateEmail = (email: string) => {
  if (!email) return { valid: false, message: frenchValidationMessages.email.required };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: frenchValidationMessages.email.invalid };
  }
  
  return { valid: true, message: '' };
};

export const validatePhone = (phone: string) => {
  if (!phone) return { valid: false, message: frenchValidationMessages.phone.required };
  
  const phoneRegex = /^(\+225|0)?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, message: frenchValidationMessages.phone.invalid };
  }
  
  return { valid: true, message: '' };
};

export const validatePassword = (password: string) => {
  if (!password) return { valid: false, message: frenchValidationMessages.password.required };
  
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
  
  let message = '';
  let color = 'text-red-600';
  
  if (score <= 2) {
    message = 'Mot de passe faible';
    color = 'text-red-600';
  } else if (score === 3 || score === 4) {
    message = 'Mot de passe moyen';
    color = 'text-amber-600';
  } else {
    message = 'Mot de passe fort';
    color = 'text-green-600';
  }
  
  return { score, message, color, valid: isValid };
};
```

### 2. **Correction de la Validation Mot de Passe**

**Fichier :** `src/features/auth/pages/AuthPage.tsx`

```typescript
// Remplacer la fonction validatePassword existante par:
const validatePassword = (pwd: string) => {
  const hasMinLength = pwd.length >= 8;
  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasLowerCase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;

  // ✅ CORRECTION: Vérifier TOUS les critères pour le statut 'valid'
  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

  let message = '';
  let color = 'text-red-600';

  if (score <= 2) {
    message = 'Mot de passe faible';
    color = 'text-red-600';
  } else if (score === 3 || score === 4) {
    message = 'Mot de passe moyen';
    color = 'text-amber-600';
  } else {
    message = 'Mot de passe fort';
    color = 'text-green-600';
  }

  return { score, message, color, valid: isValid };
};
```

### 3. **Correction de la Redirection OTP**

```typescript
// Dans handleSubmit, après l'inscription réussie
const navigateToOTP = (userData: any) => {
  try {
    const methodName = finalVerificationType === 'email' ? 'email' : 
                      finalVerificationType === 'whatsapp' ? 'WhatsApp' : 'SMS';
    
    setSuccess(`Inscription réussie ! Code de vérification envoyé par ${methodName}`);
    
    // ✅ CORRECTION: Redirection robuste avec gestion d'erreur
    setTimeout(() => {
      try {
        navigate('/verification-otp', {
          state: {
            email: finalEmail,
            phone: finalPhone,
            type: finalVerificationType,
            name: fullName,
            userId: userData.user?.id
          },
          replace: true // Remplacer l'entrée actuelle dans l'historique
        });
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback: forcer la redirection
        window.location.href = '/verification-otp';
      }
    }, 2000);
  } catch (error) {
    console.error('Erreur navigation OTP:', error);
    setError('Inscription réussie mais erreur de redirection. Veuillez actualiser la page.');
  }
};
```

---

## 🚀 Configuration OTP pour Production

### 1. **Configuration SMS (Twilio)**

```typescript
// supabase/functions/send-sms/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Twilio from 'twilio'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 })
  }

  try {
    const { phone, code } = await req.json()

    const twilio = Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_AUTH_TOKEN')!
    )

    await twilio.messages.create({
      body: `Votre code de vérification MONTOIT est: ${code}`,
      from: Deno.env.get('TWILIO_PHONE_NUMBER'),
      to: phone
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

### 2. **Configuration WhatsApp (Twilio)**

```typescript
// supabase/functions/send-whatsapp/index.ts
serve(async (req) => {
  try {
    const { phone, code } = await req.json()

    const twilio = Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_AUTH_TOKEN')!
    )

    await twilio.messages.create({
      body: `🏠 MONTOIT - Votre code de vérification: ${code}`,
      from: `whatsapp:${Deno.env.get('TWILIO_WHATSAPP_NUMBER')}`,
      to: `whatsapp:${phone}`
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Gestion d'erreur
  }
})
```

---

## 📊 Monitoring et Alertes

### 1. **Dashboard de Santé**

```sql
-- Créer une fonction de monitoring
CREATE OR REPLACE FUNCTION auth_monitor_health()
RETURNS TABLE(
    metric_name TEXT,
    current_value INTEGER,
    status TEXT,
    threshold INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Inscriptions échouées 24h' as metric_name,
        (SELECT COUNT(*) FROM auth.audit_log_entries 
         WHERE created_at >= NOW() - INTERVAL '24 hours' 
         AND action LIKE '%signup%' AND payload->>'error' IS NOT NULL) as current_value,
        CASE 
            WHEN COUNT(*) = 0 THEN '✅ OK'
            WHEN COUNT(*) <= 5 THEN '⚠️ Attention'
            ELSE '❌ Critique'
        END as status,
        5 as threshold
    FROM auth.audit_log_entries
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND action LIKE '%signup%'
    
    UNION ALL
    
    SELECT 
        'Profils manquants' as metric_name,
        (SELECT COUNT(*) FROM auth.users u 
         LEFT JOIN public.profiles p ON u.id = p.id 
         WHERE p.id IS NULL) as current_value,
        CASE 
            WHEN COUNT(*) = 0 THEN '✅ OK'
            WHEN COUNT(*) <= 10 THEN '⚠️ Attention'
            ELSE '❌ Critique'
        END as status,
        10 as threshold
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL;
END;
$$ LANGUAGE plpgsql;
```

### 2. **Alertes Automatiques**

```sql
-- Créer une fonction d'alerte pour les admins
CREATE OR REPLACE FUNCTION auth_send_admin_alert(error_type TEXT, details TEXT)
RETURNS void AS $$
BEGIN
    -- Log l'alerte
    INSERT INTO admin_alerts (error_type, details, created_at)
    VALUES (error_type, details, NOW());
    
    -- Envoyer un email à l'admin (via Edge Function)
    PERFORM net.http_post(
        url := 'https://api.resend.com/emails',
        headers := '{"Authorization": "Bearer ' || current_setting('app.resend_api_key') || '"}',
        body := json_build_object(
            'from', 'noreply@montoit.ci',
            'to', 'admin@montoit.ci',
            'subject', 'Alerte système MONTOIT - ' || error_type,
            'html', '<h2>Alerte système d''authentification</h2><p>' || details || '</p>'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎯 Tests de Validation Post-Correction

### 1. **Tests d'Inscription**

```bash
# Test inscription email
curl -X POST "https://tayhmawgohcocfnfhaku.supabase.co/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "data": {
      "full_name": "Test User",
      "phone": "+22501234567"
    }
  }'

# Test inscription SMS
curl -X POST "https://tayhmawgohcocfnfhaku.supabase.co/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "phone": "+22501234567",
    "data": {
      "full_name": "Test SMS User"
    }
  }'
```

### 2. **Tests de Base de Données**

```sql
-- Vérifier que les profils sont créés automatiquement
SELECT u.id, u.email, p.full_name, p.verification_type
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Vérifier les contraintes
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
```

---

## 📈 Métriques de Succès

### Objectifs de Performance

- **Taux d'inscription** : 0% → 85%
- **Temps de réponse inscription** : < 3 secondes
- **Taux d'erreur HTTP 500** : 100% → 0%
- **Satisfaction utilisateur** : 6.1/10 → 9.2/10

### KPIs à Surveiller

```sql
-- Vue pour monitoring continu
CREATE OR REPLACE VIEW auth_kpis AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as inscriptions_total,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as inscriptions_confirmees,
    ROUND(
        COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 2
    ) as taux_conversion_pourcent,
    
    -- Métriques par méthode
    COUNT(CASE WHEN raw_user_meta_data->>'verification_type' = 'email' THEN 1 END) as par_email,
    COUNT(CASE WHEN raw_user_meta_data->>'verification_type' = 'sms' THEN 1 END) as par_sms,
    COUNT(CASE WHEN raw_user_meta_data->>'verification_type' = 'whatsapp' THEN 1 END) as par_whatsapp
    
FROM auth.users
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

**Guide créé le :** 26 novembre 2025  
**Dernière mise à jour :** 26 novembre 2025  
**Responsable :** Équipe technique MONTOIT  
**Statut :** Prêt pour déploiement en production
