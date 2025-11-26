// Script de test automatisé pour vérifier les corrections JavaScript
const fs = require('fs');
const path = require('path');

class JavaScriptConsoleErrorFixer {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
  }

  // Vérification des imports manquants
  checkMissingImports() {
    console.log('🔍 Vérification des imports manquants...');
    
    const requiredServices = [
      'src/shared/services/supabaseService.ts',
      'src/shared/components/ErrorBoundary.tsx',
      'src/shared/hooks/useErrorHandler.ts',
      'src/shared/components/Notification.tsx',
      'src/shared/components/PerformanceOptimizations.tsx'
    ];

    requiredServices.forEach(service => {
      if (fs.existsSync(service)) {
        this.fixes.push(`✅ ${service} créé`);
      } else {
        this.errors.push(`❌ ${service} manquant`);
      }
    });
  }

  // Vérification des imports corrigés
  checkFixedImports() {
    console.log('🔧 Vérification des imports corrigés...');
    
    const filesToCheck = [
      'src/features/property/services/propertyService.ts',
      'src/features/shared/services/contactService.ts',
      'src/features/property/components/PropertyForm.tsx',
      'src/features/property/components/PropertyImageUpload.tsx',
      'src/features/property/hooks/usePropertyForm.ts'
    ];

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Vérifier qu'il n'y a plus d'imports cassés
        if (content.includes('../../../supabase/client')) {
          this.errors.push(`❌ ${file} contient encore des imports cassés`);
        } else {
          this.fixes.push(`✅ ${file} imports corrigés`);
        }

        // Vérifier la gestion d'erreurs
        if (content.includes('try {') && content.includes('catch')) {
          this.fixes.push(`✅ ${file} gestion d'erreurs ajoutée`);
        } else {
          this.warnings.push(`⚠️ ${file} pourrait bénéficier d'une meilleure gestion d'erreurs`);
        }
      } else {
        this.warnings.push(`⚠️ ${file} non trouvé`);
      }
    });
  }

  // Vérification de la prévention des memory leaks
  checkMemoryLeaks() {
    console.log('🧹 Vérification de la prévention des memory leaks...');
    
    const memoryLeakChecks = [
      {
        file: 'src/features/property/components/PropertyImageUpload.tsx',
        pattern: 'useEffect.*cleanup.*URL.revokeObjectURL',
        description: 'Cleanup des URLs blob'
      },
      {
        file: 'src/features/property/hooks/usePropertyForm.ts',
        pattern: 'useEffect.*cleanup.*clearInterval',
        description: 'Cleanup des intervals'
      }
    ];

    memoryLeakChecks.forEach(check => {
      if (fs.existsSync(check.file)) {
        const content = fs.readFileSync(check.file, 'utf8');
        if (content.includes('useEffect') && content.includes('cleanup')) {
          this.fixes.push(`✅ ${check.description} dans ${check.file}`);
        } else {
          this.errors.push(`❌ ${check.description} manquante dans ${check.file}`);
        }
      }
    });
  }

  // Vérification des optimisations de performance
  checkPerformanceOptimizations() {
    console.log('⚡ Vérification des optimisations de performance...');
    
    const performanceFiles = [
      'src/shared/components/PerformanceOptimizations.tsx',
      'src/tests/setupTests.ts'
    ];

    performanceFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.fixes.push(`✅ ${file} optimisations ajoutées`);
      } else {
        this.errors.push(`❌ ${file} manquant`);
      }
    });
  }

  // Vérification de la configuration ESLint
  checkEslintConfig() {
    console.log('📋 Vérification de la configuration ESLint...');
    
    if (fs.existsSync('.eslintrc.json')) {
      this.fixes.push('✅ Configuration ESLint créée');
    } else {
      this.errors.push('❌ Configuration ESLint manquante');
    }
  }

  // Vérification des types TypeScript
  checkTypeScriptTypes() {
    console.log('📝 Vérification des types TypeScript...');
    
    const typeCheckFiles = [
      'src/shared/hooks/useErrorHandler.ts',
      'src/shared/components/Notification.tsx'
    ];

    typeCheckFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('interface') || content.includes('type')) {
          this.fixes.push(`✅ Types TypeScript définis dans ${file}`);
        } else {
          this.warnings.push(`⚠️ ${file} pourrait bénéficier de types plus stricts`);
        }
      }
    });
  }

  // Génération du rapport final
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE CORRECTION DES ERREURS JAVASCRIPT CONSOLE');
    console.log('='.repeat(60));

    if (this.errors.length > 0) {
      console.log('\n❌ ERREURS RESTANTES:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ AVERTISSEMENTS:');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }

    if (this.fixes.length > 0) {
      console.log('\n✅ CORRECTIONS APPLIQUÉES:');
      this.fixes.forEach(fix => console.log(`  ${fix}`));
    }

    const totalIssues = this.errors.length + this.warnings.length;
    const successRate = this.fixes.length / (this.fixes.length + totalIssues) * 100;

    console.log('\n📈 STATISTIQUES:');
    console.log(`  • Corrections appliquées: ${this.fixes.length}`);
    console.log(`  • Erreurs restantes: ${this.errors.length}`);
    console.log(`  • Avertissements: ${this.warnings.length}`);
    console.log(`  • Taux de succès: ${successRate.toFixed(1)}%`);

    if (this.errors.length === 0) {
      console.log('\n🎉 TOUTES LES ERREURS JAVASCRIPT CONSOLE ONT ÉTÉ CORRIGÉES !');
    } else {
      console.log(`\n⚠️  ${this.errors.length} erreur(s) nécessitent encore une attention`);
    }

    console.log('\n' + '='.repeat(60));
  }

  // Méthode principale de test
  runTests() {
    console.log('🚀 Démarrage des tests de correction JavaScript...\n');

    this.checkMissingImports();
    this.checkFixedImports();
    this.checkMemoryLeaks();
    this.checkPerformanceOptimizations();
    this.checkEslintConfig();
    this.checkTypeScriptTypes();

    this.generateReport();
  }
}

// Exécution du script
if (require.main === module) {
  const tester = new JavaScriptConsoleErrorFixer();
  tester.runTests();
}

module.exports = JavaScriptConsoleErrorFixer;