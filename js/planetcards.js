const gridContainer = document.querySelector(".grid-container"); // container til kortene
let cards = []; // tomt array til kort
let firstCard, secondCard; // variabler til de valgte kort
let lockBoard = false; // lås for at forhindre klik mens man tjekker match
let score = 0; // startscore

document.querySelector(".score").textContent = score; // viser startscore

// Hent data (kortene)
fetch("./json/planetgame/data/cards.json")  
.then(res => res.json())
.then(data => {
    cards = [...data, ...data]; // fordobler kort-arrayet (så der er par)
    shuffleCards();              // blander kortene
    generateCards();             // laver kortene i DOM'en
});


function shuffleCards(){
    let currentIndex = cards.length,  // Start med at gemme længden af 'cards-arrayet' i currentIndex.
        randomIndex, //her gemmer vi den randomsorteret array
        temporaryValue;

    while (currentIndex !== 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex]; //enZZ´´
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards(){
    gridContainer.innerHTML = "";  // rydder containeren først

    cards.forEach(card => {
        const cardElement = document.createElement("div"); // lav et nyt div-element
        cardElement.classList.add("card");                 // giv det klassen "card"
        cardElement.dataset.name = card.name;               // gem kortets navn i data-attribut

        // tilføj HTML for kortets forside og bagside
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src="${card.image}" alt="${card.name}">
            </div>
            <div class="back"></div>
        `;

        cardElement.addEventListener("click", flipCard);   // gør kortet klikbart
        gridContainer.appendChild(cardElement);             // tilføj kortet til containeren
    });
}
function flipCard(){
    if (lockBoard) return;        // hvis brættet er låst, gør ikke noget
    if (this === firstCard) return;  // hvis man klikker på samme kort igen, gør ikke noget

    this.classList.add("flipped");  // "vend" kortet (tilføj CSS-klasse)

    if (!firstCard){
        firstCard = this;   // hvis det er første kort, gem det og stop funktionen
        return;
    }

    secondCard = this;      // hvis første kort allerede er valgt, så gem dette som andet kort
    document.querySelector(".score").textContent = score;  // opdater score på siden
    lockBoard = true;       // lås brættet, så man ikke kan klikke mere indtil match tjek er færdigt

    checkForMatch();        // tjek om de to kort matcher
}


function checkForMatch(){
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        score++;
        document.querySelector(".score").textContent = score;
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards(){
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards(){
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        resetBoard();
    }, 1000);
}

function resetBoard(){
   firstCard = null;
   secondCard = null;
   lockBoard = null;

}

function restart(){
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}