(function() {
    'use strict';
    let gameTrue = true;
    let count = 0;
    let timerId;
    let remainingSeconds;
    let timer;
    let cardArray;
    let allC;

    window.addEventListener('load', init);

    function init() {
        const startButton = id('start-btn');
        startButton.addEventListener('click', toggleView);

        const backButton = id('back-btn');
        backButton.addEventListener('click', toggleView);

        const refresh = id('refresh-btn');
        refresh.addEventListener('click', allNewCards);
    }

    function toggleView() {
        const gameView = id('game-view');
        const menuView = id('menu-view');

        if(!gameTrue){
            gameView.classList.add('hidden');
            menuView.classList.remove('hidden');
            gameTrue = true;
            clearInterval(timer);
            count = 0;
            id('set-count').textContent = `${count}`;
            editDeck("remove");
        } else { //game begins
            menuView.classList.add('hidden');
            gameView.classList.remove('hidden');
            gameTrue = false;
            startTimer();

            editDeck("add");
        }
    }

    function isASet(selected) {
        let attributes = [];
        for (let i = 0; i < selected.length; i++) {
          attributes.push(selected[i].id.split("-"));
        }
        for (let i = 0; i < attributes[0].length; i++) {
          let allSame = attributes[0][i] === attributes[1][i] &&
                        attributes[1][i] === attributes[2][i];
          let allDiff = attributes[0][i] !== attributes[1][i] &&
                        attributes[1][i] !== attributes[2][i] &&
                        attributes[0][i] !== attributes[2][i];
          if (!(allDiff || allSame)) {
            return false;
          }
        }
        return true;
      }

      function generateRandomAttributes(isEasy) {
        let color;
        let fill;
        let shape;
        let count;

        if(isEasy){
            fill = "solid";
        } else {
            fill = findAttribute("fill");
        }

        color = findAttribute("color");
        shape = findAttribute("shape");
        count = Math.floor(Math.random() * 3 + 1);

        return [color, fill, shape, count];
      }

      function generateUniqueCard(isEasy) {
        cardArray = generateRandomAttributes(isEasy);
        const allCards = qsa('.card');

        let helper = true;
        while(helper == true){
            if(!isUnique(allCards, cardArray)){
                cardArray = generateRandomAttributes(isEasy);
            } else {
                helper = false;
            }
        } 

        const newDiv = document.createElement('div');
        const uniqueCardId = `${cardArray[0]}-${cardArray[1]}-${cardArray[2]}-${cardArray[3]}`
        newDiv.id = uniqueCardId;
        newDiv.classList.add("card");

        let count = cardArray[3];
        for(let i = 0; i < count; i++){
            let image = document.createElement('img');
            image.src = `img/${cardArray[0]}-${cardArray[1]}-${cardArray[2]}.png`;
            image.alt = `${cardArray[0]}-${cardArray[1]}-${cardArray[2]}`;
            newDiv.appendChild(image);
        }
        
        newDiv.addEventListener('click', cardSelected);

        return newDiv;
      }

      function startTimer() {
        remainingSeconds = qs('select').value; 
        timerId = id('time');
        let minutes = remainingSeconds/60;
        timerId.textContent = `${minutes}:00`;
        timer = setInterval(advanceTimer, 1000);
      }

      function advanceTimer() { 
        if(remainingSeconds > 0){
            let seconds = remainingSeconds%60;
            let minute = Math.floor(remainingSeconds/60);
            if(seconds < 10){
                timerId.textContent = `${minute}:0${seconds}`;
            } else {
                timerId.textContent = `${minute}:${seconds}`;
            } 
            remainingSeconds--;
        } else {
            timerId.textContent = `0:00`;
            clearInterval(timer);
            for(let i = 0; i< allC.length; i++){
                allC[i].removeEventListener('click', cardSelected);
            }
        }
      }
      
      function cardSelected() { 
        let clickEvent = event.currentTarget;
        clickEvent.classList.toggle('selected');
        const selectCard = Array.from(qsa('.card.selected'));
        let result = isASet(selectCard);

        if(selectCard.length == 3){
            qsa('.card').forEach(curr => curr.removeEventListener('click', cardSelected));
            selectCard.forEach(current => current.classList.remove('selected'));
            selectCard.forEach(cards => {
                cards.classList.add('hide-imgs');
                let displayText = document.createElement('p');
                displayText.textContent  = result ? 'SET!' : 'Not a Set :(';
                cards.appendChild(displayText);
            })

            if(result == true){
                count++;
                setWasFound(selectCard);
            } else {
                noSet(selectCard);
            }
        }
      }

      function setWasFound(card){
        let setCount = id('set-count');
        setCount.textContent = `${count}`;
        setTimeout(function(){
            for(let i = 0; i < card.length; i++){
                let difficulty = qs('input').checked;
                card[i].replaceWith(generateUniqueCard(difficulty));
            }
            addListen();
        }, 1000);
      }
      
      function noSet(card){
        setTimeout(function(){
            card.forEach(c => {
                c.classList.remove('hide-imgs');
                let para = qs('.card > p');
                c.removeChild(para);
            })
            addListen();
        }, 1000);
        remainingSeconds = remainingSeconds - 15;
      }

      function addListen(){
        allC = qsa('.card');
        for(let i = 0; i< allC.length; i++){
            allC[i].addEventListener('click', cardSelected);
        }
      }

      function isUnique(allCards, cardArray){
        for (let i = 0; i < allCards.length; i++) {
            if(allCards[i].id == (`${cardArray[0]}-${cardArray[1]}-${cardArray[2]}-${cardArray[3]}`)){
                return false;
            }
        }
        return true;
      }

      function addCard() {
        let difficulty = qs('input').checked;
        let addToBoard = document.getElementById('board');
        addToBoard.appendChild(generateUniqueCard(difficulty));
      }

      function removeCard(){ 
        let offOfBoard = document.getElementById('board');
        let cardClass = qs('.card');
        offOfBoard.removeChild(cardClass);
      }

      function editDeck(action){
        let counter = 6;
        while(counter > 0){
            if(action == "add"){
                addCard();
            } else if(action == "remove"){
                removeCard();
            }
            counter--;
        }
      }

      function allNewCards() {
        editDeck("remove");
        editDeck("add");
      }

      function findAttribute(attribute) {
        let attRoll = Math.floor(Math.random() * 3 + 1);

            if(attRoll == 1){
                if(attribute == "fill"){
                    return "solid";
                } else if (attribute == "color"){
                    return "red";
                } else if (attribute == "shape"){
                    return "squiggle";
                }
            } else if (attRoll == 2) {
                if(attribute == "fill"){
                    return "outline";
                } else if (attribute == "color"){
                    return "purple";
                } else if (attribute == "shape"){
                    return "diamond";
                }
            } else if (attRoll == 3) {
                if(attribute == "fill"){
                    return "striped";
                } else if (attribute == "color"){
                    return "green";
                } else if (attribute == "shape"){
                    return "oval";
                }
            }
      }

    /////////////////////////////////////////////////////////////////////
    // Helper functions
    /**
    * Helper function to return the response's result text if successful, otherwise
    * returns the rejected Promise result with an error status and corresponding text
    * @param {object} res - response to check for success/error

    * @return {object} - valid response if response was successful, otherwise rejected
    *                    Promise result
    */
    async function statusCheck(res) {
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return res;
    }

    function id(id) {
        return document.getElementById(id);
    }

    function qs(selector) {
        return document.querySelector(selector);
    }

    function qsa(selector) {
        return document.querySelectorAll(selector);
    }
})();