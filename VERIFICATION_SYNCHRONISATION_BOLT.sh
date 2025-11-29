#!/bin/bash
# 🔍 SCRIPT VÉRIFICATION SYNCHRONISATION BOLT
# Exécuter dans le terminal Bolt.new

echo "🔍 VÉRIFICATION SYNCHRONISATION BOLT → GITHUB"
echo "================================================"

echo ""
echo "📋 ÉTAT ACTUEL BOLT:"
echo "  Commit actuel:"
git log --oneline -1

echo ""
echo "📋 ÉTAT RÉMOTE (GitHub):"
echo "  Branches disponibles:"
git branch -a

echo ""
echo "📋 DIFFÉRENCES LOCALES:"
git status

echo ""
echo "📋 FICHIERS CRITIQUES PRÉSENTS:"
echo "  - design-tokens.css:"
ls -la src/styles/design-tokens.css 2>/dev/null && echo "    ✅ PRÉSENT" || echo "    ❌ MANQUANT"

echo "  - Icon.tsx:"
ls -la src/shared/ui/Icon.tsx 2>/dev/null && echo "    ✅ PRÉSENT" || echo "    ❌ MANQUANT"

echo ""
echo "🔧 ACTIONS RECOMMANDÉES:"
echo "  Si différences détectées, exécuter:"
echo "  git pull origin main"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "  Si problèmes persistent:"
echo "  git fetch --all && git reset --hard origin/main"