let livresNumeriquesPage = 0;
let livresPhysiquesPage = 0;
const livresParPage = 4;
let livresPhysiques = [];

// Livres de démonstration (mock data) en cas d'erreur API
const livresDemoNumeriques = [
    {
        volumeInfo: {
            title: "Clean Code: A Handbook of Agile Software Craftsmanship",
            authors: ["Robert C. Martin"],
            imageLinks: { thumbnail: "http://books.google.com/books/content?id=_i6bDeoCQzsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
            previewLink: "https://books.google.com",
            infoLink: "https://books.google.com"
        }
    },
    {
        volumeInfo: {
            title: "The Pragmatic Programmer",
            authors: ["Andrew Hunt", "David Thomas"],
            imageLinks: { thumbnail: "http://books.google.com/books/content?id=5wBQEp6ruDkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
            previewLink: "https://books.google.com",
            infoLink: "https://books.google.com"
        }
    },
    {
        volumeInfo: {
            title: "Design Patterns",
            authors: ["Gang of Four"],
            imageLinks: { thumbnail: "http://books.google.com/books/content?id=6oHuKQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
            previewLink: "https://books.google.com",
            infoLink: "https://books.google.com"
        }
    },
    {
        volumeInfo: {
            title: "Code Complete",
            authors: ["Steve McConnell"],
            imageLinks: { thumbnail: "http://books.google.com/books/content?id=RxfwOeVlCkIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
            previewLink: "https://books.google.com",
            infoLink: "https://books.google.com"
        }
    }
];


async function fetchBooks(query, page = 0) {
    const startIndex = page * livresParPage;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${livresParPage}`;
    
    try {
        console.log('📚 Appel API Google Books:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('📊 Status réponse:', response.status);
        
        // Si le statut est 429 (Too Many Requests) ou autre erreur, utiliser les livres de démo
        if (response.status === 429 || response.status === 403) {
            console.warn('⚠️ API Google Books indisponible (429/403), utilisation des livres de démonstration');
            const demoBooks = page === 0 ? livresDemoNumeriques : [];
            displayBooks(demoBooks, page);
            if (demoBooks.length < livresParPage) {
                document.getElementById('voir-plus-numeriques').classList.add('hidden');
            }
            return;
        }
        
        const data = await response.json();
        console.log('✅ Données reçues complètes:', data);
        console.log('📖 Nombre de livres:', data.items?.length || 0);
        
        if (!data.items || data.items.length === 0) {
            console.warn("⚠️ Aucun livre trouvé pour la requête:", query);
            console.log("Utilisation des livres de démonstration");
            displayBooks(page === 0 ? livresDemoNumeriques : [], page);
            return;
        }
        
        displayBooks(data.items || [], page);
        
        if (!data.items || data.items.length < livresParPage) {
            document.getElementById('voir-plus-numeriques').classList.add('hidden');
        } else {
            document.getElementById('voir-plus-numeriques').classList.remove('hidden');
        }
        
    } catch (error) {
        console.error("❌ Erreur réseau:", error);
        console.error("Message d'erreur:", error.message);
        console.warn("📚 Utilisation des livres de démonstration");
        displayBooks(livresDemoNumeriques, page);
        document.getElementById('voir-plus-numeriques').classList.add('hidden');
    }
}

function displayBooks(books, page) {
    const booksContainer = document.getElementById('livres-books');
    console.log(`📝 displayBooks appelée - page: ${page}, livres reçus:`, books);
    
    if (page === 0) booksContainer.innerHTML = ''; // Réinitialiser si page 0

    // Vérifier que books existe et n'est pas vide
    if (!books || books.length === 0) {
        console.warn('⚠️ Pas de livres à afficher');
        if (page === 0) {
            booksContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Aucun livre trouvé</p>';
        }
        return;
    }

    console.log(`✅ Affichage de ${books.length} livres`);
    
    books.forEach((book, index) => {
        const bookInfo = book.volumeInfo;
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.setAttribute('data-title', bookInfo.title);

        bookElement.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || 'image/default-book.png'}" alt="${bookInfo.title}">
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

    if (page > 0) {
        document.getElementById('voir-moins-numeriques').classList.remove('hidden');
    } else {
        document.getElementById('voir-moins-numeriques').classList.add('hidden');
    }
}

// Masquer les livres numériques supplémentaires
function hideBooks() {
    const booksContainer = document.getElementById('livres-books');
    const books = booksContainer.querySelectorAll('.book');
    books.forEach((book, index) => {
        if (index >= livresParPage) book.remove();
    });

    livresNumeriquesPage = 0;
    document.getElementById('voir-moins-numeriques').classList.add('hidden');
    document.getElementById('voir-plus-numeriques').classList.remove('hidden');

}

async function chargerLivresPhysiques() {
    const container = document.getElementById('livres-physiques');
    if (!container) {
        console.error("Élément 'livres-physiques' introuvable");
        return;
    }

    try {
        const response = await fetch('/api/livres');
        const data = await response.json();
        
        // L'API retourne { livres, pagination } donc on récupère just le tableau
        livresPhysiques = data.livres || data;  // Compatibilité si c'est un array ou un objet
        livresPhysiquesPage = 0;
        afficherLivresPhysiques();
    } catch (error) {
        console.error('Erreur chargement livres physiques :', error);
        container.innerText = 'Impossible de charger les livres';
    }
}

// Affiche les livres physiques pour une page donnée
function afficherLivresPhysiques(page = 0) {
    const container = document.getElementById('livres-physiques');
    if (page === 0) {
        container.innerHTML = '';
    }
    const start = page * livresParPage;
    const end = start + livresParPage;
    const livresPage = livresPhysiques.slice(start, end);

    livresPage.forEach(livre => {
        const div = document.createElement('div');
        div.classList.add('book');
        div.setAttribute('data-title', livre.titre || '');
        div.setAttribute('data-category', livre.categorie || '');

        

        div.innerHTML = `
              <img src="/uploads/${livre.fichier}" alt="Face du livre" />
            <h4>${livre.titre}</h4>
            <p>${livre.auteur}</p>
            <div class="book-actions">
            <button class="btn emprunter" data-id="${livre._id}">Emprunter</button>
            </div>
        `;
        container.appendChild(div);
        
    });
    const btns = container.querySelectorAll('.emprunter');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Veuillez vous connecter pour emprunter.");

                return;
            }

            const livreId = btn.getAttribute('data-id');
            // Exemple : appel de la fonction d'emprunt
            console.log("Emprunt demandé pour :", livreId);
        });
    });
    document.getElementById('voir-moins-physiques').classList.toggle('hidden', page === 0);
    document.getElementById('voir-plus-physiques').classList.toggle('hidden', end >= livresPhysiques.length);
}


document.getElementById('voir-plus-numeriques').addEventListener('click', () => {
    livresNumeriquesPage++;
    fetchBooks('programmation', livresNumeriquesPage);
    document.getElementById('voir-moins-numeriques').classList.remove('hidden'); // → afficher le bouton

});

document.getElementById('voir-moins-numeriques').addEventListener('click', hideBooks);

document.getElementById('voir-plus-physiques').addEventListener('click', () => {
    livresPhysiquesPage++;
    afficherLivresPhysiques(livresPhysiquesPage);
    document.getElementById('voir-moins-physiques').classList.remove('hidden'); // → on l’affiche maintenant

});

document.getElementById('voir-moins-physiques').addEventListener('click', () => {
    livresPhysiquesPage = 0;
    afficherLivresPhysiques(0);
    document.getElementById('voir-moins-physiques').classList.add('hidden'); // → on le cache à nouveau

});


document.addEventListener('DOMContentLoaded', () => {
    afficherBoutonsRole();
    fetchBooks('programmation', livresNumeriquesPage);
    chargerLivresPhysiques();
     document.getElementById('voir-moins-numeriques').classList.add('hidden');
    document.getElementById('voir-moins-physiques').classList.add('hidden');
});

// Recherche par texte
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        livresNumeriquesPage = 0;
        fetchBooks(query);
    }
});

// Filtrage dynamique
document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const books = document.querySelectorAll('.book');
    books.forEach(book => {
        const title = book.getAttribute('data-title').toLowerCase();
        book.style.display = title.includes(query) ? 'block' : 'none';
    });
});

// Bouton "Toutes les catégories"
document.getElementById('all-categories-button').addEventListener('click', () => {
    const books = document.querySelectorAll('.book');
    books.forEach(book => {
        book.style.display = 'block';
    });
});

// Filtrage par catégorie
document.querySelectorAll('.category-group select').forEach(select => {
    select.addEventListener('change', function () {
        const selectedCategory = this.value;
        const books = document.querySelectorAll('.book');
        books.forEach(book => {
            const category = book.getAttribute('data-category');
            book.style.display = (selectedCategory === '' || category === selectedCategory) ? 'block' : 'none';
        });
    });
});
