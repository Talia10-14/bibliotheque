function creerCarteLivre(livre) {
    const div = document.createElement('div');
    div.classList.add('carte-livre'); // adapte à ta classe CSS
  
    div.innerHTML = `
      <img src="${livre.ficher || 'placeholder.jpg'}" alt="Couverture du livre" />
      <h3>${livre.titre}</h3>
      <p><strong>Auteur :</strong> ${livre.auteur}</p>
      <p><strong>Catégorie :</strong> ${livre.categorie}</p>
      <p><strong>Description :</strong> ${livre.description || 'Aucune'}</p>
      <p><strong>ISBN :</strong> ${livre.isbn || 'Non renseigné'}</p>
      <p><strong>Édition :</strong> ${livre.edition || 'Non renseignée'}</p>
      <p><strong>Disponible :</strong> ${livre.disponible ? 'Oui' : 'Non'}</p>
    `;
  
    return div;
  }
  