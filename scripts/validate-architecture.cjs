#!/usr/bin/env node

/**
 * Script de Validation Architecturale - MonToit
 * Ce script vérifie automatiquement la cohérence de l'architecture
 */

const fs = require('fs');
const { join, extname, basename, relative } = require('path');

class ArchitectureValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.duplicateFiles = [];
    this.stats = {
      totalFiles: 0,
      duplicateFiles: 0,
      badImports: 0,
      missingIndexFiles: 0
    };
  }

  log(message, type = 'info') {
    const prefix = {
      error: '❌',
      warning: '⚠️', 
      success: '✅',
      info: 'ℹ️'
    }[type];
    
    console.log(`${prefix} ${message}`);
  }

  // Vérifier la structure des dossiers
  validateFolderStructure() {
    this.log('Validation de la structure des dossiers...', 'info');

    const expectedStructure = {
      'src/features': 'directory',
      'src/shared': 'directory', 
      'src/shared/ui': 'directory',
      'src/shared/lib': 'directory',
      'src/shared/config': 'directory'
    };

    Object.entries(expectedStructure).forEach(([path, type]) => {
      const fullPath = join(process.cwd(), path);
      if (!fs.existsSync(fullPath)) {
        this.errors.push(`Structure manquante: ${path}`);
        this.log(`Structure manquante: ${path}`, 'error');
      } else {
        this.log(`Structure OK: ${path}`, 'success');
      }
    });

    // Vérifier les éléments qui ne devraient pas exister
    const deprecatedPaths = [
      'src/hooks',
      'src/api/repositories', 
      'src/types/index.ts' // sauf si vraiment global
    ];

    deprecatedPaths.forEach(deprecatedPath => {
      const fullPath = join(process.cwd(), deprecatedPath);
      if (fs.existsSync(fullPath)) {
        this.warnings.push(`Structure obsolète trouvée: ${deprecatedPath}`);
        this.log(`Structure obsolète trouvée: ${deprecatedPath}`, 'warning');
      }
    });
  }

  // Détecter les fichiers dupliqués
  findDuplicateFiles() {
    this.log('Détection des fichiers dupliqués...', 'info');

    const fileMap = new Map();

    const scanDirectory = (dir, basePath = '') => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = join(dir, item);
        const relativePath = join(basePath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanDirectory(fullPath, relativePath);
        } else {
          const ext = extname(item);
          if (['.ts', '.tsx'].includes(ext)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const fileKey = `${basename(item, ext)}:${content.slice(0, 200)}`;
            
            if (fileMap.has(fileKey)) {
              this.duplicateFiles.push({
                original: fileMap.get(fileKey),
                duplicate: relativePath
              });
            } else {
              fileMap.set(fileKey, relativePath);
            }
          }
        }
      });
    };

    scanDirectory('src');
    
    if (this.duplicateFiles.length > 0) {
      this.errors.push(`${this.duplicateFiles.length} fichiers dupliqués détectés`);
      this.log(`${this.duplicateFiles.length} fichiers dupliqués détectés`, 'error');
    } else {
      this.log('Aucun fichier dupliqué détecté', 'success');
    }
  }

  // Vérifier les imports
  validateImports() {
    this.log('Validation des imports...', 'info');

    const scanImports = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = join(dir, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanImports(fullPath);
        } else {
          const ext = extname(item);
          if (['.ts', '.tsx'].includes(ext)) {
            this.stats.totalFiles++;
            this.validateFileImports(fullPath);
          }
        }
      });
    };

    scanImports('src');
    
    if (this.stats.badImports > 0) {
      this.errors.push(`${this.stats.badImports} imports incorrects`);
      this.log(`${this.stats.badImports} imports incorrects`, 'error');
    } else {
      this.log('Tous les imports sont corrects', 'success');
    }
  }

  validateFileImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import.*from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Vérifier les chemins relatifs obsolètes
      if (importPath.startsWith('../') || importPath.startsWith('./')) {
        this.stats.badImports++;
        this.warnings.push(`${filePath}: Import relatif trouvé: ${importPath}`);
      }
      
      // Vérifier les imports non-aliasés vers src/
      if (importPath.startsWith('src/') && !importPath.startsWith('@/')) {
        this.stats.badImports++;
        this.errors.push(`${filePath}: Import non-aliasé trouvé: ${importPath}`);
      }
    }
  }

  // Vérifier les index files
  validateIndexFiles() {
    this.log('Validation des index files...', 'info');

    const ensureIndexFile = (dir) => {
      const indexPath = join(dir, 'index.ts');
      if (!fs.existsSync(indexPath)) {
        this.stats.missingIndexFiles++;
        this.warnings.push(`Index file manquant: ${indexPath}`);
      } else {
        this.log(`Index OK: ${relative('src', indexPath)}`, 'success');
      }
    };

    // Vérifier les features
    const featuresDir = join('src', 'features');
    if (fs.existsSync(featuresDir)) {
      const features = fs.readdirSync(featuresDir);
      features.forEach(feature => {
        const featurePath = join(featuresDir, feature);
        if (fs.statSync(featurePath).isDirectory()) {
          ensureIndexFile(featurePath);
        }
      });
    }

    // Vérifier shared
    ensureIndexFile('src/shared');
  }

  // Vérifier la cohérence des features
  validateFeatureConsistency() {
    this.log('Validation de la cohérence des features...', 'info');

    const featuresDir = join('src', 'features');
    if (!fs.existsSync(featuresDir)) return;

    const features = fs.readdirSync(featuresDir);
    
    features.forEach(feature => {
      const featurePath = join(featuresDir, feature);
      if (!fs.statSync(featurePath).isDirectory()) return;

      const expectedStructure = ['hooks', 'services', 'types', 'components', 'pages'];
      const actualStructure = fs.readdirSync(featurePath);
      
      expectedStructure.forEach(expected => {
        const exists = actualStructure.includes(expected);
        if (!exists && expected !== 'components') {
          this.warnings.push(`Feature ${feature}: ${expected} manquant`);
        }
      });
    });
  }

  // Générer le rapport final
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT DE VALIDATION ARCHITECTURALE');
    console.log('='.repeat(60));

    console.log('\n📈 STATISTIQUES:');
    console.log(`   Fichiers analysés: ${this.stats.totalFiles}`);
    console.log(`   Imports incorrects: ${this.stats.badImports}`);
    console.log(`   Index files manquants: ${this.stats.missingIndexFiles}`);

    console.log('\n❌ ERREURS:');
    if (this.errors.length === 0) {
      console.log('   Aucune erreur détectée!');
    } else {
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    console.log('\n⚠️  AVERTISSEMENTS:');
    if (this.warnings.length === 0) {
      console.log('   Aucun avertissement!');
    } else {
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }

    // Score global
    const score = this.calculateScore();
    console.log('\n🎯 SCORE ARCHITECTURAL:');
    console.log(`   ${score}/100 ${this.getScoreEmoji(score)}`);
    console.log(`   ${this.getScoreMessage(score)}`);

    // Recommandations
    console.log('\n💡 RECOMMANDATIONS:');
    this.getRecommendations().forEach(rec => {
      console.log(`   • ${rec}`);
    });
  }

  calculateScore() {
    let score = 100;
    
    // Pénalités pour les erreurs
    score -= this.errors.length * 10;
    score -= this.stats.badImports * 2;
    score -= this.stats.missingIndexFiles * 5;
    
    // Pénalités pour les warnings
    score -= this.warnings.length * 1;
    
    return Math.max(0, score);
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🟢 EXCELLENT';
    if (score >= 70) return '🟡 BON';
    if (score >= 50) return '🟠 MOYEN';
    return '🔴 CRITIQUE';
  }

  getScoreMessage(score) {
    if (score >= 90) return 'Architecture exemplaire!';
    if (score >= 70) return 'Architecture correcte, quelques améliorations possibles';
    if (score >= 50) return 'Architecture acceptable mais des corrections sont nécessaires';
    return 'Architecture nécessite une refonte majeure';
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.errors.length > 0) {
      recommendations.push('Corriger immédiatement toutes les erreurs identifiées');
    }
    
    if (this.stats.badImports > 0) {
      recommendations.push('Migrer tous les imports vers les alias (@/, @features, etc.)');
    }
    
    if (this.warnings.length > 0) {
      recommendations.push('Traiter les avertissements pour améliorer la maintenance');
    }
    
    if (this.stats.missingIndexFiles > 0) {
      recommendations.push('Créer les index files manquants pour améliorer les imports');
    }
    
    recommendations.push('Implémenter les scripts de validation dans la CI/CD');
    
    return recommendations;
  }

  // Méthode principale de validation
  validate() {
    console.log('🔍 DÉBUT DE LA VALIDATION ARCHITECTURALE\n');
    
    this.validateFolderStructure();
    this.findDuplicateFiles();
    this.validateImports();
    this.validateIndexFiles();
    this.validateFeatureConsistency();
    
    this.generateReport();
    
    // Exit avec code d'erreur si trop de problèmes
    const score = this.calculateScore();
    if (score < 50) {
      console.log('\n❌ VALIDATION ÉCHOUÉE - Score insuffisant');
      process.exit(1);
    }
    
    console.log('\n✅ VALIDATION TERMINÉE');
  }
}

// Exécuter la validation
if (require.main === module) {
  const validator = new ArchitectureValidator();
  validator.validate();
}

module.exports = ArchitectureValidator;