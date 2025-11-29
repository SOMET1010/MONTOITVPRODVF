#!/usr/bin/env python3
"""
Script de Test des APIs d'Authentification - Plateforme Mon Toit
Test direct des endpoints d'authentification pour capturer les codes de réponse HTTP
"""

import requests
import json
import time
from urllib.parse import urljoin

# Configuration de base
BASE_URL = "https://somet1010-montoit-st-jcvj.bolt.host"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    'Content-Type': 'application/json'
}

def test_endpoint(url, method='GET', data=None, description=""):
    """
    Tester un endpoint et retourner les détails de la réponse
    """
    print(f"\n{'='*60}")
    print(f"TEST: {description}")
    print(f"URL: {url}")
    print(f"Méthode: {method}")
    print(f"{'='*60}")
    
    try:
        start_time = time.time()
        
        if method.upper() == 'GET':
            response = requests.get(url, headers=HEADERS, timeout=10)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=HEADERS, json=data, timeout=10)
        else:
            response = requests.request(method, url, headers=HEADERS, json=data, timeout=10)
        
        end_time = time.time()
        response_time = round((end_time - start_time) * 1000, 2)
        
        # Analyser la réponse
        result = {
            'url': url,
            'method': method,
            'status_code': response.status_code,
            'status_text': response.reason,
            'response_time_ms': response_time,
            'headers': dict(response.headers),
            'content_length': len(response.content),
            'is_json': False,
            'content_preview': response.text[:500] if response.text else ""
        }
        
        # Tenter de parser en JSON
        try:
            json_content = response.json()
            result['is_json'] = True
            result['json_content'] = json_content
        except:
            pass
        
        # Afficher les résultats
        print(f"✅ Status Code: {response.status_code} {response.reason}")
        print(f"⏱️  Response Time: {response_time}ms")
        print(f"📊 Content Length: {len(response.content)} bytes")
        print(f"🔍 Content Type: {response.headers.get('content-type', 'unknown')}")
        
        if result['is_json']:
            print(f"📄 JSON Content: {json.dumps(json_content, indent=2)[:300]}...")
        else:
            print(f"📄 Content Preview: {response.text[:200]}...")
            
        # Analyser les codes de statut
        if 200 <= response.status_code < 300:
            print("✅ SUCCÈS - Requête acceptée")
        elif 400 <= response.status_code < 500:
            print("⚠️  ERREUR CLIENT - Problème avec la requête")
            if response.status_code == 401:
                print("   🔒 401: Non autorisé - Authentification requise")
            elif response.status_code == 403:
                print("   🚫 403: Interdit - Accès refusé")
            elif response.status_code == 404:
                print("   ❌ 404: Non trouvé - Ressource inexistante")
        elif 500 <= response.status_code < 600:
            print("🚨 ERREUR SERVEUR - Problème côté serveur")
        
        return result
        
    except requests.exceptions.Timeout:
        print("⏰ TIMEOUT - Requête expirée (>10s)")
        return {'url': url, 'error': 'timeout', 'status_code': None}
    except requests.exceptions.ConnectionError:
        print("🔌 CONNEXION ÉCHOUÉE - Impossible de se connecter")
        return {'url': url, 'error': 'connection_error', 'status_code': None}
    except Exception as e:
        print(f"❌ ERREUR: {str(e)}")
        return {'url': url, 'error': str(e), 'status_code': None}

def main():
    print("🚀 DÉBUT DES TESTS D'AUTHENTIFICATION - PLATEFORME MON TOIT")
    print(f"URL de base: {BASE_URL}")
    print(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Test 1: Pages d'authentification principales
    auth_pages = [
        ('/login', 'GET', None, 'Page de connexion (/login)'),
        ('/connexion', 'GET', None, 'Page de connexion française (/connexion)'),
        ('/inscription', 'GET', None, "Page d'inscription (/inscription)"),
        ('/signup', 'GET', None, 'Page inscription anglaise (/signup)'),
        ('/auth', 'GET', None, 'Route d\'authentification générique (/auth)'),
    ]
    
    for path, method, data, desc in auth_pages:
        url = urljoin(BASE_URL, path)
        result = test_endpoint(url, method, data, desc)
        results.append(result)
        time.sleep(1)  # Pause entre les requêtes
    
    # Test 2: Pages protégées
    protected_pages = [
        ('/dashboard', 'GET', None, 'Page dashboard protégée'),
        ('/profile', 'GET', None, 'Page profil utilisateur'),
        ('/user', 'GET', None, 'Zone utilisateur'),
        ('/account', 'GET', None, 'Compte utilisateur'),
        ('/settings', 'GET', None, 'Paramètres utilisateur'),
    ]
    
    for path, method, data, desc in protected_pages:
        url = urljoin(BASE_URL, path)
        result = test_endpoint(url, method, data, desc)
        results.append(result)
        time.sleep(1)
    
    # Test 3: API endpoints potentiels
    api_endpoints = [
        ('/api/auth/login', 'POST', {'email': 'test@test.com', 'password': 'password123'}, 'API connexion (POST)'),
        ('/api/auth/register', 'POST', {'email': 'test@test.com', 'name': 'Test User'}, 'API inscription (POST)'),
        ('/api/user/profile', 'GET', None, 'API profil utilisateur'),
        ('/api/dashboard', 'GET', None, 'API dashboard'),
        ('/supabase/auth/v1/token', 'POST', {'email': 'test@test.com', 'password': 'password123'}, 'API Supabase token'),
    ]
    
    for path, method, data, desc in api_endpoints:
        url = urljoin(BASE_URL, path)
        result = test_endpoint(url, method, data, desc)
        results.append(result)
        time.sleep(1)
    
    # Test 4: Rate limiting - requêtes rapides
    print(f"\n{'='*60}")
    print("TEST DE RATE LIMITING - 5 requêtes rapides vers /login")
    print(f"{'='*60}")
    
    for i in range(5):
        url = urljoin(BASE_URL, '/login')
        result = test_endpoint(url, 'GET', None, f'Rate limiting test #{i+1}')
        results.append(result)
        time.sleep(0.5)  # Pause courte
    
    # Test 5: Authentification avec identifiants invalides
    print(f"\n{'='*60}")
    print("TEST D'AUTHENTIFICATION AVEC IDENTIFIANTS INVALIDES")
    print(f"{'='*60}")
    
    invalid_credentials = [
        {'email': 'test@test.com', 'password': 'password123'},
        {'email': 'invalid@email.com', 'password': 'wrongpassword'},
        {'email': '', 'password': ''},
        {'email': 'test', 'password': '123'},
        {'email': None, 'password': None},
    ]
    
    for creds in invalid_credentials:
        # Test sur différents endpoints possibles
        endpoints_to_test = ['/api/auth/login', '/api/auth/signin', '/login']
        for endpoint in endpoints_to_test:
            url = urljoin(BASE_URL, endpoint)
            result = test_endpoint(url, 'POST', creds, f'Auth test avec {creds}')
            results.append(result)
            time.sleep(1)
    
    # Résumé des résultats
    print(f"\n{'='*60}")
    print("RÉSUMÉ DES RÉSULTATS")
    print(f"{'='*60}")
    
    status_counts = {}
    error_counts = {'timeout': 0, 'connection_error': 0, 'other': 0}
    
    for result in results:
        status_code = result.get('status_code')
        if status_code:
            status_counts[status_code] = status_counts.get(status_code, 0) + 1
        else:
            error_type = result.get('error', 'other')
            error_counts[error_type] = error_counts.get(error_type, 0) + 1
    
    print("📊 Distribution des codes de statut:")
    for code, count in sorted(status_counts.items()):
        print(f"   {code}: {count} occurrences")
    
    print("\n❌ Distribution des erreurs:")
    for error, count in error_counts.items():
        if count > 0:
            print(f"   {error}: {count} occurrences")
    
    # Sauvegarder les résultats
    with open('/workspace/test_results_auth.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Résultats sauvegardés dans: /workspace/test_results_auth.json")
    print("🏁 TESTS TERMINÉS")

if __name__ == "__main__":
    main()