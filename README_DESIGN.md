# 🎨 Guide du Nouveau Design

## Aperçu Rapide

Le design a été entièrement refondu pour correspondre au style moderne du portail Intuition avec :
- 🌑 Thème sombre professionnel
- 🎴 Cartes épurées et élégantes
- 🏷️ Badges de confiance subtils
- ✨ Animations et transitions douces

## 🎯 Voir les Changements

L'application est déjà en cours d'exécution ! Ouvrez simplement :

👉 **http://localhost:5173**

Les changements sont appliqués automatiquement grâce au Hot Module Replacement (HMR) de Vite.

## 📂 Fichiers Modifiés

### Styles Globaux
- `src/index.css` - Variables CSS et thème sombre

### Dashboard
- `src/pages/Dashboard.jsx` - Composant principal
- `src/pages/Dashboard.css` - Styles du dashboard

### Cartes d'Atoms
- `src/components/AtomCard.jsx` - Composant des cartes
- `src/components/AtomCard.css` - **NOUVELLES CARTES** avec fond sombre

### Barre de Recherche
- `src/components/SearchBar.jsx` - Composant de recherche
- `src/components/SearchBar.css` - Style moderne de recherche

### Page de Détail
- `src/pages/AtomDetail.jsx` - Page de détails d'un Atom
- `src/pages/AtomDetail.css` - Styles des détails

### Configuration
- `index.html` - Titre et meta tags

## 🎨 Variables CSS Disponibles

Toutes les couleurs sont définies dans `index.css` :

```css
--bg-primary: #0a0a0f;        /* Fond principal */
--bg-secondary: #13131a;      /* Fond secondaire */
--bg-card: #1a1a24;           /* Fond des cartes */
--bg-card-hover: #22222f;     /* Hover des cartes */

--text-primary: #ffffff;       /* Texte principal */
--text-secondary: #a0a0b2;    /* Texte secondaire */
--text-muted: #6b6b7f;        /* Texte discret */

--accent-blue: #3b82f6;       /* Bleu principal */
--accent-purple: #8b5cf6;     /* Violet */
--accent-green: #10b981;      /* Vert (haute confiance) */
--accent-yellow: #f59e0b;     /* Jaune (confiance moyenne) */
--accent-red: #ef4444;        /* Rouge (faible confiance) */

--border-color: #2a2a35;      /* Bordure normale */
--border-hover: #3a3a48;      /* Bordure hover */
```

## 🎴 Exemples de Design

### Carte d'Atom
```jsx
<div className="atom-card">
  {/* Badge de confiance avec classe conditionnelle */}
  <div className={`atom-card-confidence ${confidence.cssClass}`}>
    <span className="confidence-emoji">🟢</span>
    <span className="confidence-label">Haute</span>
  </div>
  
  {/* Contenu */}
  <div className="atom-card-body">
    <p className="atom-description">...</p>
  </div>
  
  {/* Footer avec métriques */}
  <div className="atom-card-footer">
    <div className="atom-metric">
      <span className="metric-label">Signal</span>
      <span className="metric-value">2,500.75</span>
    </div>
  </div>
</div>
```

### Badge de Confiance

Les badges ont 3 niveaux avec classes CSS :
- `.high` - Vert avec fond transparent
- `.medium` - Jaune avec fond transparent  
- `.low` - Rouge avec fond transparent

## 🔄 Hot Reload

Vite recharge automatiquement les changements :
- Sauvegardez n'importe quel fichier `.jsx` ou `.css`
- Le navigateur se met à jour instantanément
- Aucun rechargement manuel nécessaire

## 🎯 Tester le Design

### Dashboard
1. Ouvrez http://localhost:5173
2. Observez les cartes avec fond sombre
3. Survolez une carte pour voir l'effet de bordure

### Recherche
1. Tapez "ethereum" dans la barre de recherche
2. Cliquez sur "Rechercher"
3. Observez les résultats filtrés

### Page de Détail
1. Cliquez sur "Détails →" sur n'importe quelle carte
2. Voyez le badge de confiance coloré
3. Parcourez les métriques et sections

## 🛠️ Personnalisation

Pour modifier les couleurs, éditez les variables dans `src/index.css` :

```css
:root {
  --accent-blue: #votre-couleur;
  --bg-card: #votre-couleur;
  /* etc. */
}
```

Toutes les couleurs sont centralisées pour faciliter les modifications !

## 📱 Responsive

Le design s'adapte automatiquement :
- Desktop : Grille multi-colonnes
- Tablet : 2 colonnes
- Mobile : 1 colonne

Media queries dans chaque fichier CSS.

## ✨ Effets Visuels

### Bande colorée au survol
```css
.atom-card::before {
  /* Gradient bleu-violet en haut de la carte */
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
}
```

### Transitions
Tous les éléments ont une transition de 0.2s pour fluidité.

## 🎨 Inspiration

Design inspiré de [portal.intuition.systems](https://portal.intuition.systems/) :
- Fond sombre élégant
- Cartes avec bordures subtiles
- Badges colorés avec transparence
- Typographie moderne
- Espacements généreux

## 🚀 Performance

- CSS optimisé avec variables
- Transitions GPU-accelerated
- Images et assets minimaux
- Bundle Vite optimisé

---

💡 Pour toute question sur le design, consultez `NOUVEAU_DESIGN.md` à la racine du projet.

