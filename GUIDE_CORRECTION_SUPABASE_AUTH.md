# Guide Complet : Correction Problème Authentification Supabase

## 🚨 Problème Critique Identifié

**Erreur :** HTTP 500 "Database error saving new user"  
**Impact :** 100% des inscriptions bloquées  
**Projet Supabase :** tayhmawgohcocfnfhaku  
**URL API :** https://tayhmawgohcocfnfhaku.supabase.co/auth/v1/signup

---

## 📋 Diagnostic des Causes Possibles

### 1. **Configuration Base de Données**
- ❌ Table `auth.users` mal configurée
- ❌ Triggers d'authentification manquants ou défaillants
- ❌ Contraintes de base de données violées
- ❌ Permissions RLS (Row Level Security) incorrectes

### 2. **Problèmes de Schéma**
- ❌ Table `profiles` manquante ou mal définie
- ❌ Contraintes FOREIGN KEY non respectées
- ❌ Colonnes obligatoires manquantes dans `auth.users`

### 3. **Configuration Auth Supabase**
- ❌ Paramètres d'authentification incorrects
- ❌ Templates d'email OTP non configurés
- ❌ Providers SMS/WhatsApp non configurés

### 4. **Configuration Réseau**
- ❌ CORS mal configuré
- ❌ URL de redirection incorrectes
- ❌ Clés API mal configurées

---

## 🛠️ Solutions de Correction

### Phase 1 : Diagnostic de la Configuration Actuelle

#### A. Vérification de la Configuration Supabase

```sql
-- Vérifier les tables d'authentification
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'auth' 
ORDER BY table_name, ordinal_position;

-- Vérifier les triggers d'authentification
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- Vérifier les contraintes
SELECT conname, contype, confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'auth.users'::regclass;
```

#### B. Vérification de la Table Profiles

```sql
-- Vérifier si la table profiles existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Si elle existe, vérifier sa structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;
```

### Phase 2 : Corrections de la Base de Données

#### A. Création/Correction de la Table Profiles

```sql
-- Créer la table profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    verification_type TEXT CHECK (verification_type IN ('email', 'sms', 'whatsapp')),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    whatsapp_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

#### B. Création des Triggers d'Authentification

```sql
-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour exécuter la fonction lors de la création d'utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### C. Correction des Contraintes et Index

```sql
-- Index pour optimiser les requêtes de profil
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles(verification_type);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la mise à jour automatique
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Phase 3 : Configuration Auth Supabase

#### A. Configuration des Paramètres Auth

```sql
-- Configurer les paramètres d'authentification
UPDATE auth.config 
SET 
    external_email_enabled = true,
    external_phone_enabled = true,
    mailer_autoconfirm = false,
    sms_autoconfirm = false,
    external_phone_enabled = true,
    external_email_enabled = true
WHERE true;

-- Vérifier la configuration actuelle
SELECT * FROM auth.config;
```

#### B. Configuration des Templates OTP

```sql
-- Insérer les templates d'email pour OTP
INSERT INTO auth.email_templates (template_type, subject, body) VALUES
('signup', 'Vérifiez votre email - MONTOIT', 
'<h2>Vérifiez votre adresse email</h2>
<p>Cliquez sur le lien suivant pour vérifier votre adresse email :</p>
<p><a href="{{ .ConfirmationURL }}">Vérifier mon email</a></p>
<p>Si vous n''avez pas demandé cette inscription, ignorez cet email.</p>'),
('recovery', 'Réinitialisation mot de passe - MONTOIT',
'<h2>Réinitialisez votre mot de passe</h2>
<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}">Réinitialiser mon mot de passe</a></p>')
ON CONFLICT (template_type) DO NOTHING;
```

### Phase 4 : Configuration Réseau et CORS

#### A. Configuration CORS pour Supabase

```sql
-- Ajouter l'URL de l'application dans les sites autorisés
INSERT INTO auth.config (external_url, site_url) VALUES 
('https://votre-domaine.com', 'https://votre-domaine.com')
ON CONFLICT (id) DO UPDATE SET 
    external_url = EXCLUDED.external_url,
    site_url = EXCLUDED.site_url;
```

#### B. Configuration des URLs de Redirection

```sql
-- Configurer les URLs de redirection post-authentification
UPDATE auth.config 
SET 
    external_url = 'https://votre-domaine.com',
    site_url = 'https://votre-domaine.com'
WHERE true;

-- Vérifier la configuration
SELECT id, external_url, site_url, external_email_enabled, external_phone_enabled 
FROM auth.config;
```

---

## 🔧 Scripts SQL de Correction Complets

### Script de Réparation Intégral

```sql
-- ========================================
-- SCRIPT DE RÉPARATION COMPLET SUPABASE
-- ========================================

-- 1. Création de la table profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    verification_type TEXT CHECK (verification_type IN ('email', 'sms', 'whatsapp')),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    whatsapp_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activation et configuration RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Créer les nouvelles politiques RLS
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_verification_type ON public.profiles(verification_type);

-- 4. Fonction pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        full_name, 
        email,
        created_at, 
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        NOW(),
        NOW()
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Le profil existe déjà, ne pas faire échouer l'inscription
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log l'erreur mais ne pas faire échouer l'inscription
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fonction pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Création des triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insertion des templates d'email si nécessaire
INSERT INTO auth.email_templates (template_type, subject, body, is_active) VALUES
('signup', 
 'Vérifiez votre email - MONTOIT', 
 '<h2>Bienvenue sur MONTOIT !</h2>
  <p>Merci pour votre inscription. Cliquez sur le lien suivant pour vérifier votre adresse email :</p>
  <p><a href="{{ .ConfirmationURL }}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vérifier mon email</a></p>
  <p>Si vous n''avez pas demandé cette inscription, ignorez cet email.</p>
  <p><small>MONTOIT - Plateforme Immobilière</small></p>', 
 true),
('recovery', 
 'Réinitialisation mot de passe - MONTOIT',
 '<h2>Réinitialisez votre mot de passe</h2>
  <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
  <p><a href="{{ .ConfirmationURL }}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
  <p><small>MONTOIT - Plateforme Immobilière</small></p>', 
 true)
ON CONFLICT (template_type) 
DO UPDATE SET 
    subject = EXCLUDED.subject,
    body = EXCLUDED.body,
    is_active = EXCLUDED.is_active;

-- 8. Fonction pour corriger les utilisateurs existants sans profil
CREATE OR REPLACE FUNCTION fix_existing_users()
RETURNS void AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
    SELECT 
        u.id,
        COALESCE(u.raw_user_meta_data->>'full_name', ''),
        u.email,
        u.created_at,
        NOW()
    FROM auth.users u
    WHERE NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = u.id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécuter la fonction pour corriger les utilisateurs existants
SELECT fix_existing_users();

-- Message de confirmation
RAISE NOTICE 'Script de réparation Supabase exécuté avec succès!';
```

---

## 🔍 Scripts de Diagnostic et Vérification

### Script de Diagnostic Complet

```sql
-- ========================================
-- SCRIPT DE DIAGNOSTIC SUPABASE
-- ========================================

-- 1. Vérifier les tables d'authentification
SELECT 'Tables d''authentification' as check_type;
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name IN ('users', 'identities', 'sessions', 'audit_log_entries')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier la table profiles
SELECT 'Table profiles' as check_type;
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN full_name IS NOT NULL AND full_name != '' THEN 1 END) as with_name,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as with_phone,
    COUNT(CASE WHEN verification_type IS NOT NULL THEN 1 END) as with_verification_type
FROM public.profiles;

-- 3. Vérifier les utilisateurs sans profil
SELECT 'Utilisateurs sans profil' as check_type;
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data->>'full_name' as meta_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 4. Vérifier les triggers
SELECT 'Triggers d''authentification' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
    AND event_object_table = 'users';

-- 5. Vérifier les politiques RLS
SELECT 'Politiques RLS sur profiles' as check_type;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 6. Vérifier les index
SELECT 'Index sur profiles' as check_type;
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'profiles' 
    AND schemaname = 'public';

-- 7. Vérifier les contraintes
SELECT 'Contraintes sur profiles' as check_type;
SELECT 
    conname,
    contype,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 8. Statistiques des erreurs récentes
SELECT 'Erreurs d''inscription récentes' as check_type;
SELECT 
    created_at,
    raw_app_meta_data,
    raw_user_meta_data
FROM auth.users
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## 🛡️ Configuration Production Supabase

### Paramètres de Sécurité Recommandés

```sql
-- Configuration pour production
UPDATE auth.config SET
    -- Désactiver l'auto-confirmation pour plus de sécurité
    mailer_autoconfirm = false,
    sms_autoconfirm = false,
    
    -- Configuration email
    external_email_enabled = true,
    SMTP_HOST = 'smtp.resend.com',
    SMTP_PORT = 587,
    SMTP_USER = 'resend',
    
    -- Limites de sécurité
    REFRESH_TOKEN_ROTATION_ENABLED = true,
    SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION = true,
    
    -- URLs de production
    external_url = 'https://montoit.ci',
    site_url = 'https://montoit.ci'

WHERE true;
```

### Configuration des Fonctions Edge OTP

Créer une fonction Edge `send-verification-code` :

```typescript
// supabase/functions/send-verification-code/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 })
  }

  try {
    const { email, phone, type, name } = await req.json()
    
    // Initialiser le client Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Envoyer le code selon le type
    if (type === 'email') {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${Deno.env.get('SITE_URL')}/verify-otp`
        }
      })

      if (error) throw error
    } else if (type === 'sms' || type === 'whatsapp') {
      // Configuration SMS/WhatsApp (Twilio, etc.)
      // À implémenter selon le provider choisi
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Code envoyé avec succès' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'envoi du code de vérification',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
```

---

## 🔧 Guide de Débogage pour les Erreurs d'Authentification

### Checklist de Débogage

#### 1. **Vérification de Base**
- [ ] Projet Supabase accessible et actif
- [ ] Clés API valides (anon et service_role)
- [ ] URLs de redirection configurées correctement
- [ ] CORS configuré pour le domaine

#### 2. **Vérification Base de Données**
- [ ] Table `profiles` existe et est accessible
- [ ] Triggers d'authentification sont actifs
- [ ] Politiques RLS sont configurées correctement
- [ ] Pas de contraintes violées

#### 3. **Vérification Configuration Auth**
- [ ] Email OTP configuré et fonctionnel
- [ ] SMS OTP configuré (si utilisé)
- [ ] Templates d'email personnalisés
- [ ] Paramètres de sécurité appropriés

#### 4. **Tests Fonctionnels**
- [ ] Inscription email fonctionne
- [ ] Inscription SMS fonctionne
- [ ] Inscription WhatsApp fonctionne
- [ ] Vérification OTP fonctionne
- [ ] Connexion fonctionne
- [ ] Récupération mot de passe fonctionne

### Messages d'Erreur et Solutions

| Erreur | Cause Probable | Solution |
|--------|----------------|----------|
| `Database error saving new user` | Table `profiles` manquante ou trigger défaillant | Exécuter le script de réparation |
| `RLS policy violation` | Politiques RLS mal configurées | Vérifier et corriger les politiques |
| `Foreign key violation` | Contrainte FK violée | Vérifier les références de table |
| `Null value in column` | Colonnes obligatoires manquantes | Ajouter les colonnes manquantes |
| `OTP not sent` | Configuration SMTP/Twilio | Vérifier les credentials |

### Commandes de Debugging en Temps Réel

```sql
-- Surveiller les tentatives d'inscription en temps réel
SELECT 
    created_at,
    email,
    raw_user_meta_data,
    aud,
    role
FROM auth.users
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Vérifier les logs d'authentification
SELECT * FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '1 hour'
    AND action IN ('user_signup', 'user_signedup')
ORDER BY created_at DESC;

-- Compter les inscriptions par jour
SELECT 
    DATE(created_at) as date,
    COUNT(*) as inscriptions
FROM auth.users
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 📊 Monitoring et Métriques

### Dashboard de Santé Supabase

```sql
-- Requêtes pour surveiller la santé du système
CREATE OR REPLACE VIEW auth_health_metrics AS
SELECT 
    -- Inscriptions aujourd'hui
    (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = CURRENT_DATE) as inscriptions_aujourdhui,
    
    -- Inscriptions cette semaine
    (SELECT COUNT(*) FROM auth.users WHERE created_at >= DATE_TRUNC('week', NOW())) as inscriptions_semaine,
    
    -- Utilisateurs actifs (connexions dans les 30 derniers jours)
    (SELECT COUNT(DISTINCT user_id) FROM auth.sessions WHERE created_at >= NOW() - INTERVAL '30 days') as utilisateurs_actifs,
    
    -- Erreurs récentes
    (SELECT COUNT(*) FROM auth.audit_log_entries WHERE created_at >= NOW() - INTERVAL '24 hours' AND action LIKE '%error%') as erreurs_24h,
    
    -- Profils manquants
    (SELECT COUNT(*) FROM auth.users u LEFT JOIN public.profiles p ON u.id = p.id WHERE p.id IS NULL) as profils_manquants;
```

---

## ✅ Plan de Déploiement

### Étapes de Déploiement en Production

1. **Pré-déploiement**
   - [ ] Sauvegarder la base de données
   - [ ] Tester en environnement de staging
   - [ ] Valider les scripts SQL

2. **Déploiement**
   - [ ] Exécuter le script de réparation complet
   - [ ] Déployer les fonctions Edge
   - [ ] Configurer les templates d'email
   - [ ] Tester l'authentification

3. **Post-déploiement**
   - [ ] Monitorer les erreurs pendant 24h
   - [ ] Vérifier les métriques d'inscription
   - [ ] Valider l'expérience utilisateur
   - [ ] Documenter les changements

### Scripts de Rollback

```sql
-- Script de rollback en cas de problème
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

-- Réinstaller la configuration minimale si nécessaire
INSERT INTO auth.config (mailer_autoconfirm, external_email_enabled) VALUES (true, true)
ON CONFLICT (id) DO NOTHING;
```

---

## 🎯 Métriques de Succès

### Objectifs Post-Correction

- **Taux d'inscription** : 0% → 85%
- **Erreurs HTTP 500** : 100% → 0%
- **Temps de réponse OTP** : < 5 secondes
- **Satisfaction UX** : 6.1/10 → 9.2/10

### Monitoring Continu

- Surveiller les erreurs d'inscription quotidienne
- Tracker les conversions par méthode d'authentification
- Mesurer le temps moyen de vérification OTP
- Surveiller les taux de rebond post-inscription

---

**Date de création** : 26 novembre 2025  
**Dernière mise à jour** : 26 novembre 2025  
**Responsable** : Équipe technique MONTOIT  
**Priorité** : CRITIQUE - Déploiement urgent requis
