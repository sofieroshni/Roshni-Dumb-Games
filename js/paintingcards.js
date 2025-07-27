const gridContainer = document.querySelector(".grid-container");
let paintingCards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

//fetcher data
fetch("./json/paintinggame/data/cards.json")
.then(res => res.json())
.then(data => {
    paintingCards = [...data, ...data];
    shufflePaintingCards();
    generatePaintingCards();
});


function shufflePaintingCards(){
   let currentIndex = paintingCards.length, 
    randomIndex,
    temporaryValue;

    while (currentIndex !== 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = paintingCards[currentIndex]
        paintingCards[currentIndex] = paintingCards[randomIndex]
        paintingCards[randomIndex] = temporaryValue;

    }
}

function generatePaintingCards(){
    gridContainer.innerHTML= "";

    paintingCards.forEach(card=> {
        const paintingCardElement= document.createElement("div");
        paintingCardElement.classList.add("card");
        paintingCardElement.dataset.name = card.name;

        paintingCardElement.innerHTML=`
        <div class="front">
        <img class="front-image" src="${card.image}" alt="${card.name}">
        </div>
        <div class="back"></div>
        
        `;
    paintingCardElement.addEventlistener("click", flipCard);
        gridContainer.appendChild(paintingCardElement);
    });

}




function flipCard(){
    if (lockBoard) return;
    if (this===firstCard) return;
    
    this.classList.add("flipped");
    
    if(!firstCard){ //hvis ikke firstcard er der skal firstCard 
    // forblive det html element bruger klikker på
        firstCard = this;
        return;
    }

    secondCard = this;
    document.querySelector(".score").textContent = score;
    lockBoard = true; //lås brættet imens der tjekkes for match

    checkForMatch();

}


function checkForMatch(){

    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    
    if (isMatch){
        score +=2;
        document.querySelector(".score").textContent = score;
        disableCards();
    }
    else{
        unflipCards();
    }
}


function disableCards(){

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard)
    resetBoard();
}

function unflipCards(){

    setTimeout(()=>{
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        resetBoard();
    },1000);
}

function resetBoard(){

    firstCard = null;
    secondCard = null;
    lockBoard= false;
//nustiller varabler og sørger for at låsen fjernes
}

function restart(){
    resetBoard();
    shufflePaintingCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generatePaintingCards();
}

