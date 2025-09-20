
# CONTEXT.md

## Projet : EchoSphere

### 1. Objectif & Vision
Créer une application mobile (iOS d’abord, Android ensuite) qui réinvente la découverte sociale autour de l’amitié, la créativité et la sécurité. L’app propose des lives collaboratifs, des jeux, des expériences AR, et une modération IA avancée, sans aucune incitation aux rencontres physiques.

---

### 2. Fonctionnalités principales

- **Lives immersifs** : jusqu’à 20 participants actifs (caméra, micro, avatars), spectateurs illimités, réactions AR, suggestions IA de thèmes.
- **Jeux collaboratifs** : pictionary, co-création d’histoires, quiz, aventures IA, défis communautaires.
- **Partage Écho** : co-visionnage de contenus, traduction IA temps réel.
- **Événements éphémères** : flashmobs, karaokés, activités surprises générées par IA.
- **Swipes éclairés & cercles thématiques** : profils enrichis, bulles d’intérêts AR, chats de fans, suggestions IA.
- **Personnalisation** : badges évolutifs (Échos Pixels), souvenirs IA, avatars vivants.
- **Bien-être** : zones anonymes, discussions bien-être, modération IA, défis éco-friendly.
- **Sécurité** : vérification IA des profils, modération proactive, politique anti-rencontres IRL, rapports anonymes.

---

### 3. Stack technique recommandée

- **Frontend** :
  - iOS natif (Swift + SwiftUI), puis React Native ou Flutter pour cross-platform.
  - WebRTC natif pour live.
- **Backend** :
  - Node.js (TypeScript) + Fastify pour API, Go pour services temps réel, Python pour ML/IA.
  - GraphQL (Apollo) pour clients riches, REST pour simplicité.
  - mediasoup (SFU) sur Kubernetes pour streaming.
  - PostgreSQL (relationnel), Redis (cache/presence), S3 (stockage média).
  - ML/IA : FastAPI, TensorFlow/PyTorch, Whisper, modération hybride.
  - Sécurité : Varonis pour classification, monitoring, alertes.
  - CI/CD : GitHub Actions, TestFlight, Kubernetes.

---

### 4. Étapes types de développement

1. **Définir le besoin et l’objectif**
  - Rédiger un cahier des charges fonctionnel et technique.
  - Identifier les personas utilisateurs et les parcours clés.

2. **Concevoir l’architecture technique**
  - Choisir la stack (voir ci-dessus).
  - Définir les schémas de données (utilisateurs, posts, lives, badges, etc.).
  - Préparer l’infrastructure cloud (Kubernetes, DB, stockage, CI/CD).

3. **Développer le MVP**
  - Authentification, profils, live 1→many, matching, messaging.
  - Instrumenter l’analytics dès le début.

4. **Sécuriser et modérer**
  - Intégrer la modération IA, la vérification des profils, la gestion des droits.
  - Mettre en place la classification et le monitoring des accès (Varonis).

5. **Tester et itérer**
  - Tests unitaires, e2e, charge, chaos engineering.
  - Recueillir les retours utilisateurs, améliorer l’UX.

6. **Déployer et scaler**
  - Automatiser l’infra (Terraform, GitOps).
  - Prévoir la scalabilité (autoscaling SFU, microservices).

7. **Maintenir et faire évoluer**
  - Ajouter des fonctionnalités (AR, jeux, événements IA, etc.).
  - Suivre la qualité, la sécurité, la conformité (RGPD, Varonis).

---

### 5. Bonnes pratiques & recommandations

- Séparer prod/test/dev, chiffrer données au repos et en transit.
- Utiliser des services managés pour le MVP (DB, Redis, K8s, CDN, media services).
- Documenter les flux de données pour la conformité.
- Prévoir la modularité pour scaler indépendamment les composants média, signalling, ML.

---

### 6. Équipe recommandée

- Dev iOS, Backend Node/Go, Media Engineer, ML/infra Engineer, DevOps/SRE, Security Engineer, PM/UX.

---

Ce fichier sert de référence pour toute la conception, le développement et l’évolution du projet EchoSphere.
À relire à chaque nouvelle session pour garantir la cohérence technique et fonctionnelle.
