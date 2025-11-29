# 🔧 GUIDE TROUBLESHOOTING SYNCHRONISATION BOLT

## 🚨 PROBLÈME IDENTIFIÉ
Bolt.new ne reflète pas les modifications faites sur GitHub, même en utilisant le même repository.

## 📋 DIAGNOSTIC COMPLET

### ✅ État Repository GitHub (VALIDÉ)
- **Repository:** https://github.com/SOMET1010/MONTOITVPROD.git
- **Branche principale:** main
- **Dernier commit:** `8589bb9` - "🏆 SPRINT 4 FINAL: Polish & QA"
- **Fichiers synchronisés:** 
  - ✅ `design-tokens.css` (333 lignes)
  - ✅ `Icon.tsx` (244 lignes)  
  - ✅ Toutes les corrections UI/UX appliquées

### 🔍 PROBLÈMES POTENTIELS BOLT

#### 1. **Cache Projet Bolt Obsolète**
```bash
# Dans Bolt.new:
1. Aller dans Settings du projet
2. Cliquer sur "Clear Cache" ou "Reset Project"
3. Re-fetch depuis GitHub
```

#### 2. **Repository Remote Mal Configuré**
```bash
# Vérifier dans Bolt Terminal:
git remote -v
git fetch origin
git status
```

#### 3. **Branche Déconnectée**
```bash
# Dans Bolt Terminal:
git branch -a
git checkout main
git pull origin main
```

#### 4. **Configuration .git Corrompue**
```bash
# Solution radicale dans Bolt:
rm -rf .git
git init
git remote add origin https://github.com/SOMET1010/MONTOITVPROD.git
git fetch origin
git checkout main
git pull origin main --allow-unrelated-histories
```

## 🛠️ SOLUTIONS RECOMMANDÉES

### **SOLUTION 1: Synchronisation Manuelle**
1. Ouvrir Bolt.new
2. Aller dans le terminal
3. Taper ces commandes une par une:
```bash
git pull origin main
npm install
npm run dev
```

### **SOLUTION 2: Recréation Projet**
1. Supprimer le projet Bolt actuel
2. Créer nouveau projet Bolt
3. Se connecter au repository GitHub
4. Sélectionner le même repository
5. Attendre la synchronisation complète

### **SOLUTION 3: Force Refresh**
1. Dans Bolt, aller dans Settings
2. Cliquer "Force Refresh"
3. Ou utiliser les shortcuts clavier:
   - `Ctrl+Shift+R` (Windows/Linux)
   - `Cmd+Shift+R` (Mac)

## 🎯 VÉRIFICATIONS POST-SYNC

### **Vérifier que les fichiers sont présents:**
```bash
ls -la src/styles/design-tokens.css
cat src/styles/design-tokens.css | head -20
```

### **Vérifier les dernières modifications:**
```bash
git log --oneline -5
git diff HEAD~1 HEAD
```

### **Vérifier que le design system est actif:**
```bash
grep -n "design-tokens.css" src/index.css
grep -n "primary" src/styles/design-tokens.css
```

## 📞 ACTIONS IMMÉDIATES

### **EN BOLT, EXÉCUTEZ CES COMMANDES:**
```bash
# 1. Vérifier l'état actuel
git status
git log --oneline -3

# 2. Forcer la synchronisation
git fetch --all
git reset --hard origin/main
npm install

# 3. Vérifier les fichiers critiques
ls -la src/styles/design-tokens.css
cat src/shared/ui/Icon.tsx | head -10

# 4. Redémarrer le serveur
npm run dev
```

### **SI ÇA NE MARCHE PAS:**
1. **Recréer le projet Bolt** en utilisant le repository GitHub
2. **Vérifier que l'URL GitHub est correcte:** `https://github.com/SOMET1010/MONTOITVPROD`
3. **S'assurer que Bolt a les permissions** sur le repository

## 📊 COMPARAISON AVANT/APRÈS

### **AVANT (Bolt obsolète):**
- Pas de design-tokens.css
- Couleurs incohérentes  
- Statistiques "0+"
- Pas d'Icon component

### **APRÈS (GitHub synchronisé):**
- ✅ design-tokens.css unifié (#FF6C2F)
- ✅ Statistiques crédibles (31+ propriétés)
- ✅ Icon component intégré
- ✅ Design system harmonisé

---
**📝 Note:** Le repository GitHub contient TOUTES les modifications. Bolt doit simplement se synchroniser.