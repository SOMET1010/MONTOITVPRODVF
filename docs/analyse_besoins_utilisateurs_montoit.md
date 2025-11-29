# Analyse des besoins utilisateurs de la plateforme MONTOIT et cartographie des gaps fonctionnels vs Leboncoin, SeLoger et PAP

## Résumé exécutif

MONTOIT se positionne comme une agence immobilière locale à Thiais proposant un éventail complet de services transactionnels (vente, achat, location) et d’accompagnement (estimation, travaux, financement), adossée à un savoir-faire historique dans la construction sur mesure et la promotion. Côté digital, l’agence propose un moteur de recherche avec filtres avancés, des visites virtuelles, un espace propriétaire, un système d’alertes e‑mail, une estimation en ligne, et une interface partiellement multilingue[^1]. Cette base fonctionnelle, solide pour une agence de proximité, apparaît toutefois en décalage avec la profondeur et la richesse des plateformes leaders (Leboncoin, SeLoger, PAP), qui ont investi dans des fonctionnalités pro (packs, boosters, call‑tracking), des applications mobiles dédiées et unelargeur d’audience à l’échelle nationale[^2][^3][^10].

L’analyse des doléances utilisateurs met en évidence des irritants récurrents sur les leaders: fraude et annonces frauduleuses, qualité des leads et modération, fiabilité des estimations, coûts perçus élevés, performance technique et ergonomie. Ces signaux constituent une opportunité stratégique pour MONTOIT: se différencier par la qualité, la sécurité et la fiabilité de l’expérience, plutôt que par la seule profondeur d’inventaire[^3][^11][^2].

Comparativement aux leaders, les gaps prioritaires de MONTOIT concernent:
- La sécurité et la lutte anti-fraude (vérification des annonceurs, signaux d’alerte, procédures de validation).
- L’analytics et l’attribution (tableau de bord, call‑tracking, scoring des leads).
- La personnalisation (recommandations, “déjà vu”, alertes push, web/app mobile).
- Les outils pro et la monétisation (packs et boosters, mandat en ligne).
- Le SEO et l’acquisition organique (contenus et outils such as simulateurs/guides).
- La data‑room propriétaire et la qualité de l’inventaire (détection des doublons, annonces obsolètes, complétude des fiches).

Ces axes répondent directement aux irritants majeurs observés chez les leaders et s’inscrivent dans les tendances structurantes de la recherche immobiliere digitale: personnalisation, qualité de lead, sécurité/confiance, et monétisation équilibré pour les pros[^2][^3][^11].

Feuille de route proposée:
- 0–90 jours (quick wins): renforcements UX et anti‑fraude, optimisation du moteur et de l’estimation, premières métriques de conversion.
- 90–180 jours (mid‑term): call‑tracking, scoring des leads, recommandations basiques, espace pro étendu, intégration CRM.
- 6–12+ mois (long‑term): app mobile, moteur IA de recommandations, data‑room analytics, monétisation via packs et boosters, programme “Verified”.

KPI prioritaires: taux de leads qualifiés, taux de conversion visite→mandat, délai moyen de mise en relation, satisfaction client (NPS/CSAT), taux de détection de fraude, taux d’annonces obsolètes, trafic organique et part des sessions issues de requêtes “immo + zone”.

Cette ambition requiert de combler plusieurs lacunes d’information: métriques internes (trafic, conversion, leads), retour utilisateur structuré, inventaire et qualité (doublons/obsolescence), capacités techniques actuelles (architecture, limites), et modèle économique cible. Ces gaps de données sont explicités plus loin et devront être adressés en parallèle du déploiement produit[^1][^2][^3].

---

## Contexte et positionnement de MONTOIT

MONTOIT opère en Île‑de‑France (Thiais), avec une double réalité: une agence de proximité proposant vente, location, estimation, gestion, et un groupe construction/promotion au positionnement “haut de gamme” sur les maisons individuelles sur mesure et les logements collectifs[^1][^4]. L’offre digitale de l’agence (montoit‑immobilier.fr) est structurée autour de services transactionnels, d’outils d’aide à la décision (estimation en ligne) et d’éléments d’interaction (alertes, espace propriétaire, visites virtuelles). Le site met en avant l’expertise locale, la réactivité et l’accompagnement complet jusqu’au financement et aux travaux[^1].

Tableau 1 ci‑dessous synthétise les fonctionnalités et services actuellement visibles sur le site de l’agence.

Tableau 1 — Inventaire des fonctionnalités et services de l’agence MONTOIT (site officiel)

| Domaine | Détails clés |
|---|---|
| Services | Vente (appartements, maisons, terrains, immeubles neufs, parkings, biens pro), Location (classique et professionnels), Estimation, Gestion locative, Accompagnement achat, Travaux/ame­nagement, Aide au financement[^1] |
| Outils/UX | Moteur de recherche avancé (type de bien, rayon 5–30 km, budget, surface, particularités: Prestige, Investissement, Antérieur à 1980/2000, Sans vis‑à‑vis, Immeuble récent, Dernier étage), “Uniquement avec visite virtuelle”, Recherche par référence, Estimation en ligne rapide et professionnelle, Espace propriétaire, Alertes e‑mail, Annonces enrichies (“Coup de cœur”, “Nouveauté”, “Exclusif”, “Sous‑offre”), Interface multilingue (FR/EN), Accès direct aux contacts (téléphone/e‑mail)[^1] |
| Intégrations tierces | Visites virtuelles (Matterport, Nodalview, SpotVideo, Virtual Visit), Estimation détaillée (Jestimo, Pricehubble)[^1] |
| Positionnement | Expertise locale (Thiais et alentours), réactivité/professionnalisme, accompagnement de bout en bout, adossé à un groupe construction/promotion historique[^1][^4] |

Ce panorama montre une base fonctionnelle cohérente avec une agence moderne et digitale, mais qui n’expose pas encore les couches avancées que les utilisateurs et pros attendent des plateformes leaders: applications mobiles grand public et pro, outils pros packagés, deep‑links SEO structurés, analytics de performance, et dispositifs anti‑fraude visibles. Il y a là une opportunité de “sur‑qualifier” l’expérience locale face aux frustrations relevées sur les leaders[^3][^11].

---

## Paysage concurrentiel et attentes utilisateurs (Leboncoin, SeLoger, PAP)

Les trois leaders structurent leurs propositions autour de la宽度 d’audience, de la profondeur d’inventaire et de services différenciants.

- Leboncoin Immobilier s’appuie sur la puissance de la marque et une offre pro structurée (packs, boosters, “Opportunités Mandats”, “Local Affinity”), avec des fonctionnalités orientées performance commerciale (ex. call‑tracking pour suivre les appels manqués) et des signaux de personnalisation (tag “déjà vu”). Des études et communiqués mettent en avant la penetration élevée du portail et sa capacité à générer de la satisfaction perçue côté vente[^2][^5][^6][^7][^8].
- SeLoger, historiquement pro, a lancé My SeLoger Pro, une application mobile pour la gestion contacts/annonces en temps réel, et s’est ouverts aux particuliers. La plateforme développe des initiatives IA (Lab GenAI) et reste un pilier SEO et data pour les pros, malgré des doléances importantes côté modération, fraude et fiabilité des estimations[^9][^10][^14][^13].
- PAP conserve un avantage sur le segment particulier‑à‑particulier, combinant 0 % de commission, une richesse d’outils/simulateurs/guides, des coaching et des ateliers. La présence d’applications mobiles et d’un espace personnel soutient l’engagement. Les avis clients publics soulignent la proposition de valeur “sans commission” et la valeur ajoutée des outils[^3][^15].

Pour illustrer la position de marché et les différenciations, le Tableau 2 synthétise quelques statistiques clés.

Tableau 2 — Statistiques clés et position de marché (sélection)

| Plateforme | Indicateurs clés | Source |
|---|---|---|
| Leboncoin Immo | 66 % des Français avec un projet immo utilisent leboncoin immo; 42 % l’utilisent exclusivement; 75 % des clients jugent que c’est le portail qui leur permet de vendre le plus de biens[^2] | Communiqué/Solutions Pro |
| Leboncoin Immo | Fonctionnalités pro: call‑tracking, tag “déjà vu”, feuille de route 2025 (investissements et nouveautés), investissements valorisés[^5][^6][^7][^8] | Presse pro/éditeurs |
| PAP | 0 % de commission; millions de visiteurs; outils/simulateurs; apps iOS/Android; coaching et ateliers[^3][^15] | Site/App Store |
| SeLoger | My SeLoger Pro (app pro); initiatives IA (Lab GenAI); ouverture aux particuliers (depuis 2023)[^10][^13][^14] | Presse/édito |

Au‑delà des chiffres, les attentes structurantes des utilisateurs s’organisent autour de:
- La qualité des leads et la réduction des fraudes.
- La fiabilité des estimations et contenus.
- La performance et l’ergonomie (filtres pertinents, fluidité, notifications).
- La transparence des coûts et de la monétisation côté pros[^3][^11][^2].

Ces attentes se renforcent mutuellement: c’est la combinaison d’une recherche pertinente, d’une modération efficace, d’un suivi/attribution clair et d’une expérience fluide qui fait la différence, plutôt qu’un seul “volume d’annonces”.

### Leboncoin Immobilier

Leboncoin a structuré un éventail de solutions pro par segment (ancien, neuf, constructeurs), enrichies de packs et boosters pour la visibilité, et de services mandats (collecte de leads vendeurs) et de notoriété locale (Local Affinity). L’introduction de fonctionnalités comme le call‑tracking et le tag “déjà vu” répond directement aux irritants d’attribution et de personnalisation. La feuille de route 2025 et les engagements d’investissement confirment l’orientation produit et la recherche de valeur perçue côté pros[^2][^5][^6][^7][^8].

### SeLoger

SeLoger se positionne comme un acteur pro historique, avec un investissement récent dans l’app mobile My SeLoger Pro, la data et l’IA (Lab GenAI). L’ouverture aux particuliers en 2023 a rebattu les cartes concurrentielles, tout en renforçant l’importance de la modération. Les doléances publiques (fraudes, fiabilité des estimations, service client, bugs techniques) mettent en lumière la criticité des boucles de qualité et de sécurité pour préserver la confiance[^9][^10][^14][^13].

### PAP (Particulier à Particulier)

PAP capitalise sur une proposition simple et forte: 0 % de commission, enrichie par des outils/simulateurs/guides, du coaching et des ateliers. Cette valeur d’accompagnement, couplée à des applications mobiles et un espace personnel, sert une audience particuliers exigeante, en quête d’autonomie et de conseils pratiques[^3][^15].

---

## Doléances utilisateurs et irritants sur les plateformes leaders

L’analyse des retours publics met en avant des irritants convergents.

- SeLoger: une part substantielle des avis négatifs pointe la présence d’annonces frauduleuses, la modération perçue comme arbitraire, la difficulté d’entrer en contact avec le service client, des dysfonctionnements techniques (inscription, DPE), et des estimations jugées peu fiables. Ces irritants nuisent à la confiance et à la conversion[^11].
- Leboncoin: malgré une satisfaction globale élevée, les avis soulignent des irritants transverses (frais de protection/gestion, performance technique, filtres et tri perfectibles, annonces obsolètes, réponses des vendeurs), applicables à la recherche immobilière et à la gestion des leads[^2].
- Points pro: sur les forums, les professionnels récurrrent les coûts perçus, le manque de transparence de performance et d’attribution, la gestion des doublons et la concurrence déloyale perçue avec les particuliers. Ces éléments pointent le besoin d’outils pro et de monétisation équilibrés[^12].

Pour objectiver les perceptions, le Tableau 3 reprend des agrégats Trustpilot disponibles.

Tableau 3 — Indicateurs d’expérience (extraits Trustpilot)

| Plateforme | Note agrégée | Distribution (si disponible) | Points d’attention |
|---|---|---|---|
| SeLoger | n.d. (avis très polarisés) | 64 % des avis à 1★; 25 % à 5★ (sur base d’échantillon public) | Fraude/moderation, estimation, contact client, bugs techniques[^11] |
| Leboncoin | 4,5/5 (Excellent) | 76 % à 5★; 9 % à 1★ (sur large volume) | UX/filtres, performance (CAPTCHA), annonces obsolètes, transparence des frais[^2] |

En synthèse, les irritants les plus structurants sont:
1) fraude et modération; 2) fiabilité des estimations/contenus; 3) performance et ergonomie (filtres, notifications); 4) coûts perçus par les pros; 5) qualité et attribution des leads. Ces axes doivent irriguer la feuille de route de MONTOIT.

---

## Tendances fonctionnelles et technologiques (IA, personnalisation, apps)

Trois tendances structurent la next‑gen de la recherche immobilière:
- Personnalisation de la recherche et recommandations: exploitation des préférences pour ordenar les résultats et suggérer des biens pertinents (incluant le “déjà vu” et des alertes plus intelligentes)[^2][^5].
- IA et qualité des données: estimation assistée, aide à la détection de fraude, assistance à la rédaction d’annonces, et prévention des contenus à risque. L’IA devient un “filtre de confiance” autant qu’un moteur d’aide à la décision[^13][^1][^2].
- Apps mobiles (grand public et pro): mobilité, temps réel, notifications push, gestion de contacts pour les agents (ex. My SeLoger Pro), afin d’augmenter la réactivité et l’attribution des leads[^10][^3].

Pour PAP et SeLoger, la présence d’apps mobiles et de workflows “on‑the‑go” renforce l’engagement, réduit les frictions de contact et accélère la conversion. Leboncoin a déjà introduit des briques de personnalisation et d’attribution (call‑tracking, “déjà vu”). Ces tendances convergent vers un même objectif: accroître la qualité des leads et la satisfaction en réduisant le “bruit” et en accélérant la mise en relation[^2][^5][^10][^3][^13].

---

## Cartographie des gaps fonctionnels MONTOIT vs leaders

La matrice ci‑dessous compare les capacités visibles de MONTOIT aux fonctionnalités/performances des leaders sur les dimensions clés. Les évaluations “Non/Partiel/Oui” sont des jugements qualitatifs fondés sur l’analyse des sources publiques.

Tableau 4 — Matrice comparative des fonctionnalités

| Dimension | MONTOIT | Leboncoin | SeLoger | PAP |
|---|---|---|---|---|
| Moteur de recherche/filtrage | Oui (avancé: type, rayon, budget, surface, particularités, visites virtuelles, recherche par référence)[^1] | Oui (mass market, filtres + personnalisation “déjà vu”)[^2][^5] | Oui (portail historique, filtres) | Oui (particuliers, filtres + outils)[^3] |
| Estimation en ligne | Oui (rapide/pro; intégrations Jestimo/Pricehubble)[^1] | n.d. (non documenté ici) | Oui (estimation; critiques de fiabilité)[^11] | Oui (simulateurs/estimation)[^3] |
| Espace propriétaire | Oui[^1] | Oui (espace pro et outils d’attribution)[^2] | Oui (espace pro + app)[^10] | Oui (“Mon espace”)[^3] |
| Alertes e‑mail | Oui[^1] | Oui (alertes + “déjà vu”)[^5] | Oui | Oui[^3] |
| Alertes push/mobile | n.d. | n.d. | Oui (apps)[^3][^10] | Oui (apps)[^3][^15] |
| Tag “déjà vu” | n.d. | Oui (2024)[^5] | n.d. | n.d. |
| Call‑tracking / attribution | n.d. | Oui (suivi des appels manqués)[^5] | n.d. (app pro gère contacts, attribution à renforcer) | n.d. |
| App mobile pro | n.d. | n.d. | Oui (My SeLoger Pro)[^10] | n.a. (particuliers) |
| Boosters / packs pro | n.d. | Oui (packs, boosters, mandat, notoriété locale)[^2] | n.d. (monétisation non documentée ici) | n.a. (0 % commission) |
| Opportunités mandats | n.d. | Oui (leads vendeurs)[^2] | n.d. | n.d. |
| Outils/simulateurs/guides | Estimation et outils intégrés[^1] | Outils pros et attribution[^2] | IA (Lab GenAI), estimation; app | Large panoplie outils/simulateurs/guides[^3] |
| Apps iOS/Android | n.d. | n.d. | Oui (SeLoger)[^3] | Oui (PAP)[^15] |
| Audience/penetration | Local/regional | Très large (66 %/42 % stats d’usage)[^2] | Large/pro/historique | Large particuliers |
| Anti‑fraude / modération | n.d. (non documenté) | n.d. (à renforcer selon retours) | Critiques fortes (fraude, modération)[^11] | Modération particuliers (outils/guides)[^3] |
| Contrôle qualité annonces (doublons/obsolescence) | n.d. | n.d. | n.d. | n.d. |

Les gaps critiques pour MONTOIT se situent donc sur:
- Sécurité/modération (anti‑fraude visible).
- Attribution et analytics (call‑tracking, scoring leads).
- Personnalisation et mobilité (recommandations, push, app).
- Monétisation pro (packs/boosters, mandat en ligne).
- Qualité de l’inventaire (doublons/obsolescence) et SEO (contenus/guides).

---

## Recommandations stratégiques et feuille de route

L’approche recommandée privilégie un mix “qualité de l’expérience d’abord” et “capabilités pro”, en cohérence avec les irritants identifiés chez les leaders. Trois chantiers doivent être menés en parallèle: UX et confiance (anti‑fraude, filtres, estimation), performance et attribution (call‑tracking, scoring, analytics), et croissance monétisée (packs pro, contenu SEO, mandat en ligne).

Tableau 5 — Backlog priorisé (effort/impact estimé)

| Initiative | Description | Impact | Effort | Dépendances |
|---|---|---|---|---|
| Anti‑fraude v1 | Vérification basic des annonceurs, règles de détection (signaux: prix anormaux, EXIF photo, incohérences), revue et signalement | Élevé (confiance, qualité) | Moyen | Outils internes, process |
| Filtres & moteurs | Enrichissement des filtres (DPE, charges, copropriété, travaux), tri pertinent, “déjà vu” | Élevé (conversion) | Moyen | Data dispo |
| Estimation v2 | Transparence methodo + intervalle de confiance; intégration multi‑sources | Élevé (crédibilité) | Moyen/Élevé | Prestataires data |
| Call‑tracking | Numéros trackés, suivi appels manqués, logs d’attribution | Élevé (pro ROI) | Moyen | Opérateur telecom |
| Lead scoring | Règles + modèle simple (qualification, engagement) | Moyen/Élevé (vente) | Moyen | Données d’usage |
| Recommandations basiques | “Pour vous” par préférences浏览历史 | Moyen | Moyen | Moteur règles |
| Espace pro étendu | Mise en ligne mandat, documents, tunnel enrichi | Élevé (monétisation) | Moyen | CRM/legals |
| CRM & analytics | Tableau de bord conversion, A/B tests, cohortes | Élevé (Pilotage) | Moyen/Élevé | Data pipeline |
| Contenu & SEO | Guides/simulateurs (frais de notaire, prix/m², investissement), optim. on‑page | Moyen/Élevé | Moyen | Rédaction |
| App mobile | App grand public (alertes push, recherche, favoris) | Élevé (engagement) | Élevé | Dev mobile |
| Data‑room propriétaire | Détection doublons/obsolescence, qualité inventaire | Élevé (efficience) | Moyen/Élevé | Outils data |
| Programme “Verified” | Badge d’identité/qualité annonceur | Moyen (confiance) | Moyen | KYC/ops |

Roadmap proposée:
- 0–90 jours: Anti‑fraude v1; Filtres & moteurs; Transparence estimation; Premiers dashboards (leads, conversion); Mise en ligne de guides/simulateurs; Définition KPI; Pré‑étude call‑tracking.
- 90–180 jours: Call‑tracking; Lead scoring; Recommandations basiques; Espace pro (mandat en ligne); Intégration CRM; Déploiement app iOS/Android en version 1.
- 6–12+ mois: IA recommandations; Data‑room qualité inventaire; Programme “Verified”; Monétisation (packs/boosters); Optimisation continue SEO/SEA.

Tableau 6 — Feuille de route par trimestre (objectifs et jalons)

| Trimestre | Objectifs | Jalons clés | Risques principaux |
|---|---|---|---|
| T1 (0–90 j) | Réduire friction et risque | Anti‑fraude v1, filtres, estimation v2, dashboards, contenus/SEO initiaux | Data incomplète, charge interne |
| T2 (90–150 j) | Améliorer attribution et qualification | Call‑tracking, scoring, espace pro, CRM, app v1 | Intégrations, adoption pro |
| T3 (6–12 m) | Accélérer croissance monétisée | Recommandations IA, data‑room, “Verified”, packs/boosters | Product‑market fit monétisation |

KPI cibles (indicatives, à calibrer post‑diagnostic): taux de leads qualifiés (+30 % en 6 mois), taux de conversion visite→mandat (+20 % en 6 mois), délai moyen de mise en relation (<24 h), satisfaction client (NPS > 40), taux de détection de fraude (≥95 % des tentatives), taux d’annonces obsolètes (<5 %), trafic organique (+25 % en 6 mois).

Cette feuille de route est directement adossée aux irritants prioritaires (fraude, estimation, filtres, attribution) et s’aligne sur les meilleures pratiques observées chez les leaders (packs/boosters, call‑tracking, apps, IA), tout en capitalisant sur l’avantage local de MONTOIT[^5][^2][^10][^1].

---

## Plan d’exécution, risques et métriques

Gouvernance produit:
- Product Manager (roadmap, priorisation, KPI).
- Tech Lead (architecture, intégrations, sécurité).
- Data/Analytics (tableaux de bord, scoring, A/B tests).
- UX/Content (recherche, estimation, guides, anti‑fraude).
- Ops/Compliance (modération, “Verified”, légaux).

Métriques de succès:
- Leads: volume, qualité, coût par lead (si paid), délais de réponse.
- Conversion: taux de visite → contact → mandat; part des leads attribués (call‑tracking).
- Engagement: taux d’usage des filtres/estimations, ouvrir des alertes,留存 sur site.
- Qualité: taux d’annonces obsolètes, doublons détectés, taux de fraude bloquée.
- Satisfaction: NPS/CSAT par étapes (recherche, contact, signature).

Risques et parades:
- Fraude: renforcer la vérification (KYC light), signaux automatiques, boucle de modération, program “Verified”[^11].
- Qualité des données: contrôle à l’édition, règles de cohérence, data‑room de qualité inventaire.
- Adoption pro: offres simples, ROI démontrable (attribution), onboarding et support dédiés[^2].
- Intégrations: phasage, POCs, tests de charge, monitoring.
- Monétisation: MVP gratuit/valeur prouvée → packs (ex. visibilité prioritaire, boost local), boosters ciblés[^2].

Tableau 7 — Registre des risques (extrait)

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Fraude persistante | Moyen | Élevé | Anti‑fraude v1 + “Verified” + modération proactive[^11] |
| Data incomplète | Moyen | Moyen/Élevé | Data‑room, enrichissement progressif |
| Faible adoption pro | Moyen | Élevé | Packs clairs, ROI mesuré, onboarding[^2] |
| Défaillance technique | Faible/Moyen | Élevé | Tests, monitoring, phasage des mises en prod |
| Content gap SEO | Moyen | Moyen | Studio de contenu, simulateurs, partenariats |

Mesure et optimisation continue:
- Tableaux de bord hebdo/mensuels; revue quarterly OKRs.
- A/B testing sur filtres, ranking, formats d’estimation.
- Enquêtes utilisateurs post‑contact et post‑signature.
- Boucle d’amélioration anti‑fraude (false positives/negatives).

---

## Annexes

Annexe A — Référentiel des fonctionnalités (sélection, par plateforme)

| Plateforme | Fonctionnalités (exemples) | Sources |
|---|---|---|
| MONTOIT | Vente/location/estimation/gestion; moteur de recherche avancé; espace propriétaire; alertes e‑mail; estimation (Jestimo/Pricehubble); visites virtuelles (Matterport/Nodalview/SpotVideo/Virtual Visit); multilingue (FR/EN)[^1] | Site officiel |
| Leboncoin | Solutions pro: packs, boosters, “Opportunités Mandats”, “Local Affinity”; fonctionnalités: call‑tracking, tag “déjà vu”; invests 2024/2025[^2][^5][^6][^7][^8] | Solutions pro/presse pro |
| SeLoger | My SeLoger Pro (app); initiatives IA (Lab GenAI); ouverture aux particuliers; estimation; portail historique[^9][^10][^14][^13] | Presse/édito |
| PAP | 0 % de commission; outils/simulateurs/guides; coaching; ateliers; apps iOS/Android; espace personnel[^3][^15] | Site/App Store |

Annexe B — Notes méthodologiques et limites
- Les comparaisons “Non/Partiel/Oui” reposent sur une lecture structurée des sources publiques disponibles; l’absence d’information publique ne signifie pas l’absence de fonctionnalité.
- Certaines métriques (trafic, conversion, coûts) ne sont pas publiées pour MONTOIT; elles devront être instrumentées dans la phase 0–90 jours.
- Les agrégats d’avis (ex. Trustpilot) sont indicatifs et subjectifs; ils servent d’indicateurs de tendances, pas de mesures exhaustives.

Annexe C — Glossaire
- Boosters: options payantes pour augmenter la visibilité d’une annonce.
- Call‑tracking: suivi des appels (dont manqués) via numéros dédiés pour mesurer l’attribution.
- Lead scoring: note de qualification d’un lead selon des règles et/ou modèle prédictif.
- Doublons/obsolescence: annonces identiques ou不再有效 (vendu/loué) non à jour.
- “Déjà vu”: marqueur de consulter précédent,用于 personnaliser la recherche.

---

## Information gaps à adresser

- Données d’usage et de performance de MONTOIT: trafic, conversion, origines, taux de leads qualifiés, satisfaction (NPS/CSAT).
- Inventaire et qualité des annonces: volume,更新, doublons, taux d’annonces obsolètes, taux de signalement/fraude.
- Voix du client: enquêtes, verbatim, demandes récurrentes.
- Capacités techniques actuelles: architecture, intégrations, anti‑fraude, call‑tracking, analytics, notifications.
- Roadmap interne: priorités, ressources, dépendances.
- Modèle économique et monétisation: abonnements, boosters, packs, mandat en ligne.

Ces lacunes doivent être comblées en parallèle des premières réalisations (0–90 jours) pour calibrer la feuille de route et les KPI cibles[^1].

---

## Références

[^1]: MONTOIT Immobilier — Agence à Thiais. https://www.montoit-immobilier.fr/  
[^2]: Immobilier — leboncoin Solutions Pro. https://leboncoinsolutionspro.fr/immobilier/  
[^3]: PAP — Immobilier (Particulier à Particulier). https://www.pap.fr/  
[^4]: MONTOIT Immobilier — Constructions & Promotions. https://www.montoit-immobilier.eu/  
[^5]: leboncoin immo lance de nouvelles fonctionnalités pour les pros de l’immobilier. https://immo2.pro/actualite-immobilier/leboncoin-immo-lance-de-nouvelles-fonctionnalites-pour-les-pros-de-limmobilier/  
[^6]: leboncoin immo intensifie ses investissements… et lance de nouvelles fonctionnalités. https://presse.leboncoincorporate.com/actualites/leboncoin-immo-intensifie-ses-investissements-pour-les-professionnels-de-limmobilier-et-lance-de-nouvelles-fonctionnalites-pour-les-aider-dans-leur-business-0cc22-763e3.html  
[^7]: Salon RENT 2024 : leboncoin dévoile sa feuille de route pour 2025. https://www.journaldelagence.com/1402785-salon-rent-2024-leboncoin-devoile-sa-feuille-de-route-pour-2025  
[^8]: Leboncoin immo : « Nous investissons pour offrir la meilleure expérience… ». https://www.immomatin.com/portails/sites-professionnels/nous-investissons-pour-offrir-la-meilleure-experience-a-nos-utilisateurs-a-flament-leboncoin.html  
[^9]: SeLoger — Portail immobilier. https://www.seloger.com/  
[^10]: SeLoger lance My SeLoger Pro : l’app qui booste la performance des professionnels. https://www.immomatin.com/portails/sites-professionnels/seloger-lance-my-seloger-pro-l-app-qui-booste-la-performance-des-professionnels-de-l-immobilier.html  
[^11]: Lisez les avis marchands de www.seloger.com — Trustpilot. https://fr.trustpilot.com/review/www.seloger.com  
[^12]: Les parts de marché PRO VS PAP sur leboncoin (article premium, commentaires utiles). https://immo2.pro/tendances-immobilier/les-parts-de-marche-pro-vs-pap-sur-leboncoin-dans-les-10-principales-villes-francaises/  
[^13]: [RENT2023] Digital crush : l’immobilier à l’heure de l’IA — Edito SeLoger. https://edito.seloger.com/tendances/insolite/rent2023-digital-crush-l-immobilier-l-heure-de-l-intelligence-artificielle  
[^14]: Seloger s’ouvre aux particuliers : une petite révolution — Xerfi. https://www.xerfi.com/blog/Seloger-s-ouvre-aux-particuliers-une-petite-revolution_1839  
[^15]: PAP immobilier — Application iOS. https://apps.apple.com/fr/app/pap-immobilier-vente-location/id405041010