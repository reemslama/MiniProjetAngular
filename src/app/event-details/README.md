# EventHub — Catalogue d’événements

Mini-projet réalisé avec Angular 21 pour présenter les activités
d’une association étudiante : ateliers, conférences et événements sportifs.

L’application fonctionne côté client avec des données définies en TypeScript.

## Fonctionnalités

- Affichage de six événements sous forme de cartes.
- Filtrage par catégorie.
- Ajout et retrait des favoris avec compteur.
- Affichage des détails d’un événement.
- Gestion des événements inexistants et des URL inconnues.
- Page À propos chargée en lazy loading.
- Interface adaptée aux ordinateurs et aux téléphones.

Les favoris sont conservés pendant la navigation et réinitialisés
au rechargement de la page.

## Technologies et versions

- Angular : 21 — préciser la version exacte.
- TypeScript : préciser la version.
- Node.js : 22.23.2.
- npm : préciser la version après la mise à jour.
- HTML et CSS.

Pour vérifier les versions :

```powershell
node -v
npm -v


## Lancement

ng serve

Ouvrir http://localhost:4200 dans le navigateur.


## Structure et rôle des composants

- Header : affiche le titre et les liens de navigation.
- EventList : affiche les événements et gère le filtre et les favoris.
- EventCard : présente un événement et transmet les clics au parent.
- EventDetails : affiche l’événement correspondant à l’identifiant de l’URL.
- About : présente l’application.
- NotFound : affiche un message pour les URL inconnues.

Le fichier src/app/data/events.ts contient les données.
Le service Favorites conserve les identifiants des favoris.

## Routes

- /events : catalogue des événements.
- /events/:id : détails d’un événement.
- /about : présentation de l’application.
- Toute URL inconnue : page 404.

## Notions Angular utilisées

- Composants standalone.
- Signals : signal(), set(), update() et computed().
- Communication parent/enfant : input() et output().
- Interpolation, property binding et event binding.
- Boucles et conditions : @for, track, @empty et @if/@else.
- Pipes : date, currency et uppercase.
- Navigation : router-outlet, routerLink et routerLinkActive.
- Lazy loading avec loadComponent().
