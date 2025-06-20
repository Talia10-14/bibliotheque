let livresNumeriquesPage = 0;
const livresParPage = 4; 
// Fonction pour rechercher des livres numériques via l'API Google Books
async function fetchBooks(query, page = 0) {
    const startIndex = page * livresParPage;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${livresParPage}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayBooks(data.items, page);
    } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
    }
}

// Fonction pour afficher les livres numériques
function displayBooks(books, page) {
    const booksContainer = document.getElementById('livres-books');
    if (page === 0) booksContainer.innerHTML = ''; // Réinitialiser si c'est la première page

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.setAttribute('data-title', bookInfo.title); // Ajouter l'attribut data-title

        bookElement.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || '/image/default-book.png'}" alt="${bookInfo.title}">
            <h4>${bookInfo.title}</h4>
            <p>${bookInfo.authors?.join(', ') || 'Auteur inconnu'}</p>
            <div class="book-actions">
                <div class="centered-btn">
                <a href="${bookInfo.previewLink}" target="_blank" class="btn lire">Lire</a>
                </div>
                <a href="${bookInfo.infoLink}" target="_blank" class="download">
                    <i class="fas fa-info-circle"></i>
                </a>
            </div>
            
        `;
        booksContainer.appendChild(bookElement);
    });

    // Afficher/Masquer les boutons "Voir plus" et "Voir moins"
    document.getElementById('voir-moins-numeriques').classList.remove('hidden');
}

// Fonction pour masquer les livres numériques supplémentaires
function hideBooks() {
    const booksContainer = document.getElementById('livres-books');
    const books = booksContainer.querySelectorAll('.book');
    books.forEach((book, index) => {
        if (index >= livresParPage) book.remove(); // Supprimer les livres supplémentaires
    });

    livresNumeriquesPage = 0; // Réinitialiser la page
    document.getElementById('voir-moins-numeriques').classList.add('hidden');
}

// Gestionnaires d'événements pour les boutons
document.getElementById('voir-plus-numeriques').addEventListener('click', () => {
    livresNumeriquesPage++;
    fetchBooks('programmation', livresNumeriquesPage);
});

document.getElementById('voir-moins-numeriques').addEventListener('click', hideBooks);

// Charger les livres numériques par défaut
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks('programmation', livresNumeriquesPage);
});

// Ajouter un gestionnaire d'événements pour la recherche
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        fetchBooks(query);
    }
});

// Gestionnaire pour la recherche dynamique
document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const books = document.querySelectorAll('.book'); // Sélectionne tous les livres (numériques et physiques)

    books.forEach(book => {
        const title = book.getAttribute('data-title').toLowerCase(); // Récupère le titre du livre
        if (title.includes(query)) {
            book.style.display = 'block'; // Affiche le livre si le titre correspond à la recherche
        } else {
            book.style.display = 'none'; // Masque le livre sinon
        }
    });
});

// Gestionnaire pour le bouton "Toutes les catégories"
document.getElementById('all-categories-button').addEventListener('click', () => {
    const books = document.querySelectorAll('.book');
    books.forEach(book => {
        book.style.display = 'block';
    });
});

document.querySelectorAll('.category-group select').forEach(select => {
    select.addEventListener('change', function () {
        const selectedCategory = this.value;
        const books = document.querySelectorAll('.book'); // Sélectionne tous les livres (numériques et physiques)

        books.forEach(book => {
            const category = book.getAttribute('data-category'); // Récupère la catégorie du livre
            if (selectedCategory === '' || category === selectedCategory) {
                book.style.display = 'block'; // Affiche le livre si la catégorie correspond
            } else {
                book.style.display = 'none'; // Masque le livre sinon
            }
        });
    });
});

// Liste des livres physiques supplémentaires
const livresPhysiquesSupplementaires = [
    {
        title: "Livre Physique 9",
        author: "Auteur 9",
        image: "/image/img17.jpeg",
        category: "classique"
    },
    {
        title: "Livre Physique 10",
        author: "Auteur 10",
        image: "/image/img18.jpeg",
        category: "science"
    },
    {
        title: "Livre Physique 11",
        author: "Auteur 11",
        image: "/image/img19.jpeg",
        category: "technologie"
    },
    {
        title: "Livre Physique 12",
        author: "Auteur 12",
        image: "/image/img20.jpeg",
        category: "arts"
    }
];
async function chargerLivresPhysiques() {
    try {
        const token = localStorage.getItem('token'); 

      const res = await fetch('http://localhost:5000/api/livres',{
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
      } );
      if (!res.ok) throw new Error('Erreur chargement livres');
      
      const livres = await res.json();
  
      const conteneur = document.getElementById('livres-physiques');
      conteneur.innerHTML = ''; // vide avant affichage
  
  
      // Limite d'affichage initiale (exemple 5 livres)
      let limite = 5;
      let affichageComplet = false;
  
      function afficherLivres(liste) {
        conteneur.innerHTML = '';
        liste.forEach(livre => {
          const divLivre = document.createElement('div');
          divLivre.classList.add('livre-item');
          divLivre.textContent = `${livre.titre} par ${livre.auteur}`;
          conteneur.appendChild(divLivre);
        });
      }
  
      afficherLivres(livresPhysiques.slice(0, limite));
  
      const btnVoirPlus = document.getElementById('voir-plus-physiques');
      const btnVoirMoins = document.getElementById('voir-moins-physiques');
  
      btnVoirPlus.addEventListener('click', () => {
        afficherLivres(livresPhysiques);
        btnVoirPlus.classList.add('hidden');
        btnVoirMoins.classList.remove('hidden');
      });
  
      btnVoirMoins.addEventListener('click', () => {
        afficherLivres(livresPhysiques.slice(0, limite));
        btnVoirMoins.classList.add('hidden');
        btnVoirPlus.classList.remove('hidden');
      });
  
    } catch (error) {
      console.error(error);
    }
  }
  
  window.addEventListener('DOMContentLoaded', chargerLivresPhysiques);
  