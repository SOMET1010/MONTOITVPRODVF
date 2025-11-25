# Guide de Test - Corrections Validation Inscription MONTOIT

## Objectif
Valider que les 4 corrections critiques de validation d'inscription fonctionnent correctement.

## Tests à Effectuer

### Test 1: Validation Email (Message en Français)

**Étapes** :
1. Aller sur `/inscription`
2. Sélectionner méthode "Email" 
3. Dans le champ email, taper : `emailinvalide`
4. Aller sur un autre champ ou essayer de soumettre
5. Cliquer dans le champ mot de passe

**Résultat Attendu** :
- ✅ Message d'erreur affiché : "L'adresse email doit contenir un symbole @ et un domaine valide (ex: nom@domaine.com)"
- ❌ NE PAS voir : "Please include an '@' in the email address"

**Statut** : [ ] À tester

---

### Test 2: Validation Mot de Passe (Cohérence)

**Étapes** :
1. Aller sur `/inscription`
2. Saisir nom : "Jean Dupont"
3. Email : "jean.dupont.test@example.com" 
4. Mot de passe : "MotDePasse123!"
5. Observer l'indicateur de force

**Résultat Attendu** :
- ✅ Indicateur : "Mot de passe fort" (vert)
- ✅ Tous les critères affichés avec coches vertes :
  - ✓ Au moins 8 caractères
  - ✓ Une majuscule  
  - ✓ Une minuscule
  - ✓ Un chiffre
  - ✓ Un caractère spécial
- ✅ Le formulaire doit autoriser la soumission

**Statut** : [ ] À tester

---

### Test 3: Redirection après Inscription

**Étapes** :
1. Aller sur `/inscription`
2. Remplir tous les champs correctement :
   - Nom : "Marie Martin"
   - Email : "marie.martin.test@example.com"  
   - Téléphone : "07 12 34 56 78"
   - Mot de passe : "MotDePasse123!"
3. Méthode vérification : Email
4. Cliquer "S'inscrire"

**Résultat Attendu** :
- ✅ Message de succès affiché
- ✅ Redirection automatique vers `/verification-otp`
- ❌ NE PAS être redirigé vers `/contact`

**Statut** : [ ] À tester

---

### Test 4: Envoi Code OTP

**Étapes** :
1. Après Test 3, vérifier la page `/verification-otp`
2. Vérifier qu'un code a été envoyé par email
3. Tester aussi avec SMS :
   - Retourner à `/inscription`
   - Méthode "SMS" 
   - Téléphone : "07 12 34 56 78"
   - S'inscrire

**Résultat Attendu** :
- ✅ Message "Code de vérification envoyé par Email"
- ✅ Page OTP affiche les champs pour entrer le code
- ✅ Test SMS : "Code de vérification envoyé par SMS"

**Statut** : [ ] À tester

---

### Test 5: Validation Téléphone (Messages Français)

**Étapes** :
1. Aller sur `/inscription`
2. Méthode SMS ou WhatsApp
3. Téléphone : "07 12" (incomplet)
4. Aller sur un autre champ

**Résultat Attendu** :
- ✅ Message : "6 chiffre(s) manquant(s)" (français)
- ✅ NE PAS voir : Messages d'erreur en anglais

**Statut** : [ ] À tester

---

### Test 6: Cas d'Erreur OTP

**Étapes** :
1. Tenter une inscription avec un email incorrect
2. Observer le message d'erreur en français
3. Vérifier que l'utilisateur peut réessayer

**Résultat Attendu** :
- ✅ Message d'erreur informatif en français
- ✅ L'utilisateur reste sur la page d'inscription
- ✅ Peut corriger et réessayer

**Statut** : [ ] À tester

---

## Liste de Contrôle Globale

| Test | Statut | Notes |
|------|--------|-------|
| 1. Email validation français | [ ] | |
| 2. Mot de passe cohérent | [ ] | |
| 3. Redirection verification-otp | [ ] | |
| 4. Envoi code OTP | [ ] | |
| 5. Téléphone validation français | [ ] | |
| 6. Gestion d'erreur robuste | [ ] | |

## Scénarios de Régression

### Scénario A: Inscription Email Classique
- ✅ Formulaire se remplit correctement
- ✅ Validation en temps réel fonctionne  
- ✅ Soumission réussie avec redirection
- ✅ Code OTP reçu

### Scénario B: Inscription SMS
- ✅ Sélection méthode SMS fonctionne
- ✅ Validation téléphone correcte
- ✅ Inscription et envoi SMS
- ✅ Code reçu par SMS

### Scénario C: Inscription WhatsApp  
- ✅ Sélection méthode WhatsApp fonctionne
- ✅ Validation téléphone correcte
- ✅ Inscription et envoi WhatsApp
- ✅ Message reçu par WhatsApp

## Métriques de Succès

- **100%** des messages d'erreur en français
- **0** redirection vers `/contact` après inscription valide  
- **100%** cohérence indicateur mot de passe / validation
- **>95%** taux de réussite envoi code OTP

## Debug et Logs

Si des problèmes surviennent, vérifier dans la console :
```javascript
// Logs attendus après corrections :
console.log('Sending verification code with params:', params);
console.log('OTP sent successfully:', data);
console.log('Navigating to verification page...');

// Rechercher ces erreurs :
// - "OTP Function Error"
// - "OTP Response not successful"  
// - "Navigation error"
```

## Fichiers à Surveiller

- `src/features/auth/pages/AuthPage.tsx` : Validation et soumission
- `src/shared/components/PhoneInput.tsx` : Validation téléphone
- Console navigateur : Logs d'envoi OTP
- Network tab : Appels vers Supabase functions

## Rollback Plan

Si les corrections causent des problèmes :
1. Restaurer la version précédente de `AuthPage.tsx`
2. Redéployer sans les corrections  
3. Identifier le problème spécifique
4. Appliquer les corrections une par une
