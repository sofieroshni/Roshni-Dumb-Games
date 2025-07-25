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
    let currentIndex = cards.length,  // Start med at gemme længden af 'cards-arrayet' i currentIndex. Dette er således de
        randomIndex, //her gemmer vi den randomsorteret array, det her vi gemmer den tilfædige index
        temporaryValue; //

    while (currentIndex !== 0){ //imens currentIndex ikke er 0 så skal følgende ske (altså at der er noget inde i arrayet)
        randomIndex = Math.floor(Math.random() * currentIndex); // Math.random er en indbygget funktion som går ind i arrayet og vælger et tilfældigt tal imellem 0- 1-antal kort. Derefter ganger man det med den nuværende indeks for at få alle kort med. fordi at det ligger inde i math.floor rundes det ned til det nærmeste heltal så der ikke kommer et 1,5 kort. 
        currentIndex -= 1; //vi arbejder baglæns igennem kortene (trækker en fra) 
        temporaryValue = cards[currentIndex]; //Jeg putter currentIndex som er den nuværende kort antal ind i cards dette 
        cards[currentIndex] = cards[randomIndex]; // alt inde i arrayet (det nuværende) bliver nu sat til at være random fordi at det var det vi definerede randomIndex til. Det betyder at alt inde i arrayet "bytter plads"
        cards[randomIndex] = temporaryValue; // Derefter siger vi at vores nye værdi er en midlertidlig værdi. 
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
    let isMatch = firstCard.dataset.name === secondCard.dataset.name; //definerer isMatch så det 
    // svarer til at dataet for første og andet kort matcher

    if (isMatch) {
        score +=5; //scorer ska lgå op med 5
        document.querySelector(".score").textContent = score; // henter html element og siger at dets textContent skal svarer til scorer
        disableCards(); //hvis der er match skal funktionen disable cards kører
    } else {
        unflipCards(); //hvis der ikke er match skal funktionen unflipCards kører og den fjerner ccs-klassen "flipped"
    }
}

function disableCards(){ //fjerner EventListeners så man ikke kan klikke på de 2 kort igen 
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard(); //reseter variablerne 
}

//vender kort hvis der er Mismatch
function unflipCards(){
    setTimeout(() => {
        firstCard.classList.remove("flipped"); //fjern css-klassen flipped
        secondCard.classList.remove("flipped");

        resetBoard(); //reset boardet
    }, 1000); //Efter 1 sekund (1000 ms) fjerner vi flipped-klassen, så kortene vises med bagsiden igen.
}

function resetBoard(){
   firstCard = null;
   secondCard = null; //nulstiller variablerne så der ikek er tegn på at bruger har klikket på noget
   lockBoard = false; //lås fjernes så man kan klikke på boardet igen
}

function restart(){
    resetBoard(); //sørger for at spillet restarter 
    shuffleCards(); //at kortene blandes
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}


