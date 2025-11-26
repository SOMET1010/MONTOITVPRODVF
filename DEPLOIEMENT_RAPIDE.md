# Guide de Déploiement Rapide - Correction Authentification Supabase

## 🚀 Déploiement en 4 Étapes

### Étape 1: Exécuter le Script de Réparation SQL

```sql
-- Copier le contenu de SCRIPT_REPAIR_SUPABASE_AUTH.sql
-- L'exécuter dans l'éditeur SQL Supabase

-- Résultat attendu : ✅ Script de réparation Supabase exécuté avec succès!
```

### Étape 2: Déployer les Fonctions Edge

```bash
# Installer Supabase CLI si pas déjà fait
npm install -g supabase

# Se connecter au projet
supabase login
supabase link --project-ref tayhmawgohcocfnfhaku

# Créer les fonctions Edge
mkdir -p supabase/functions/send-verification-code
mkdir -p supabase/functions/verify-otp
mkdir -p supabase/functions/auth-monitor

# Déployer les fonctions
supabase functions deploy send-verification-code
supabase functions deploy verify-otp
supabase functions deploy auth-monitor
```

### Étape 3: Configurer les Variables d'Environnement

```bash
# Configurer les secrets Twilio (pour SMS/WhatsApp)
supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890
supabase secrets set TWILIO_WHATSAPP_NUMBER=+1234567890
supabase secrets set SITE_URL=https://somet1010-montoit-st-dzj4.bolt.host
```

### Étape 4: Déployer les Corrections Frontend

```typescript
// Remplacer le contenu de src/features/auth/pages/AuthPage.tsx
// par le contenu de code_corrections_authpage_complete.tsx
```

---

## ✅ Tests de Validation Post-Déploiement

### Test 1: Inscription Email

```bash
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
```

**Résultat attendu :** `{ "user": {...}, "session": {...} }`

### Test 2: Vérification Base de Données

```sql
-- Vérifier que les profils sont créés automatiquement
SELECT u.id, u.email, p.full_name, p.verification_type
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 5;
```

**Résultat attendu :** Liste d'utilisateurs avec leurs profils

### Test 3: Test de la Fonction OTP

```bash
curl -X POST "https://tayhmawgohcocfnfhaku.functions.supabase.co/send-verification-code" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"test@example.com","type":"email","name":"Test User"}'
```

**Résultat attendu :** `{ "success": true, "message": "Code envoyé avec succès par email" }`

---

## 📊 Métriques de Succès Attendues

| Métrique | Avant | Objectif | Temps |
|----------|-------|----------|-------|
| Taux d'inscription | 0% | 85% | < 48h |
| Erreurs HTTP 500 | 100% | 0% | < 24h |
| Temps réponse OTP | N/A | < 5s | < 48h |
| Satisfaction UX | 6.1/10 | 9.2/10 | 1 semaine |

---

## 🚨 Rollback en Cas de Problème

```sql
-- Rollback complet
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.otp_verifications;
DROP TABLE IF EXISTS public.auth_metrics;

-- Réinstaller la configuration minimale
UPDATE auth.config 
SET mailer_autoconfirm = true, external_email_enabled = true 
WHERE true;
```

---

## 📞 Support et Contact

En cas de problème lors du déploiement :

1. **Vérifier les logs** : Dashboard Supabase → Logs → Auth
2. **Consulter le guide** : `GUIDE_DEBUG_SUPABASE_AUTH.md`
3. **Exécuter le diagnostic** : `SCRIPT_REPAIR_SUPABASE_AUTH.sql` (section diagnostic)

**Date de création :** 26 novembre 2025  
**Version :** 1.0  
**Statut :** Prêt pour production
