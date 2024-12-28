
const resources_bar = document.getElementById("resources_bar");
const opponent_battlefield = document.getElementById("opponent_battlefield");
const player_battlefield = document.getElementById("player_battlefield");
const player_cards = document.getElementById("player_cards");
const shop = document.getElementById("shop");
const next_turn_button = document.getElementById("next_turn_button");
const fighterDOM = document.getElementById("fighter");

let currentShowingScreen = document.getElementById('mainMenu');
let IAM;
let gamestate;

function showScreen(screen) {
    const div = document.getElementById(screen);
    div.style.display = 'block';
    currentShowingScreen.style.display = 'none';
    currentShowingScreen = div;
}

async function create_new_game() {
    IAM = "p1";
    showScreen("loadingMenu");

    gamestate = {
        stage: "waitingForPlayerTwo",
    };

    await uploadGamestate();

    await waitForStage("p1");

    showScreen("gameMenu");

    renderAll();
}

function renderAll() {
    renderResourceBar();
    renderHand();
    renderBattlefield("p1");
    renderBattlefield("p2");
    if (canIPlay()) {
        next_turn_button.innerHTML = "Next turn";
        next_turn_button.disabled = false;
    } else if (canIDefend()) {
        next_turn_button.innerHTML = "Defend";
        next_turn_button.disabled = false;
    } else {
        next_turn_button.innerHTML = "Next turn";
        next_turn_button.disabled = true;
    }
}

async function next_turn() {
    if (canIPlay()) {
        gamestate.stage = getEnemy();
        renderAll();
        await uploadGamestate();
        waitForStageAndRender(IAM);
    } else if (canIDefend()) {
        const card = gamestate.battlefields[getEnemy()].find(c => c.fighting);
        if (card == null) {
            throw new Error("No card is fighting");
        }
        const defendingCards = gamestate.battlefields[IAM].filter(c => c.defending);
        if (defendingCards.length > 1) {
            alert("Fuck you just select one card bro");
            return;
        }
        enemyCardToTarget.HP -= card.power;
        card.HP -= enemyCardToTarget.power;
        if (enemyCardToTarget.HP <= 0) {
            gamestate.battlefields[getEnemy()] = gamestate.battlefields[getEnemy()].filter(c => c != enemyCardToTarget);
        }
        if (card.HP <= 0) {
            gamestate.battlefields[IAM] = gamestate.battlefields[IAM].filter(c => c != card);
        }
        gamestate.stage = getEnemy();
        renderAll();
        await uploadGamestate();
        waitForStageAndRender(IAM);
    }
}

function renderResourceBar() {
    resources_bar.innerHTML = `
    <span style="margin-left: 10px; margin-right: 10px;">${IAM == "p1" ? "Player 1" : "Player 2"}</span>
    <img src="images/mana.png" alt="Mana Image" style="height:5vh"> ${gamestate.mana_counts[IAM]}
    <img src="images/coin.png" alt="Coin Image" style="height:5vh; margin-left: 10px; margin-right: 5px;"> ${gamestate.coin_counts[IAM]}
    `;
}

let previewingCard = null;

function hidePreviewingCard() {

    if (previewingCard) {
        previewingCard.card_span.parentElement.removeChild(previewingCard.placeholder);
        previewingCard.card_span.style.position = "relative";
        previewingCard.card_span.style.height = "22vh";
        previewingCard.card_span.style.top = "";
        previewingCard.card_span.style.left = "";
        previewingCard.card_span.style.zIndex = "";
        previewingCard.card_span.children[0].classList.remove("preview_card");
        previewingCard.card_span.children[0].classList.add(previewingCard.class_to_apply);
        previewingCard.right_div_wrapper.style.display = "none";
        previewingCard.non_right_div_wrapper.style.display = "block";
        previewingCard = null;
    }

}


async function moveCardToFightingPosition(card) {
    card.fighting = true;
    renderAll();
    await uploadGamestate();
}

async function moveCardToDefendingPosition(card) {
    card.defending = true;
    renderAll();
    await uploadGamestate();
}

async function askUserToSelectDefender() {
    gamestate.stage = getEnemy();
    gamestate.activity_type = "selectingDefender";
    renderAll();
    await uploadGamestate();
    await waitForStageAndRender(IAM);
}

document.body.onkeydown = evt => {
    if (evt.key == "Escape") {
        hidePreviewingCard();
    }
}

function createCardElm(card, right_div, class_to_apply, non_right_div=null) {
    let card_span = document.createElement("div");

    card_span.style.height = "22vh";
    card_span.style.display = "flex";
    card_span.style.justifyContent = "center";
    card_span.style.alignItems = "center";
    card_span.style.position = "relative";
    card_span.innerHTML = `
    <img src="images/${card.image}" alt="Card Image" class="card ${class_to_apply}">
    `;

    let right_div_wrapper = document.createElement("div");
    right_div_wrapper.style.marginLeft = "10px";
    right_div_wrapper.style.display = "none";
    right_div_wrapper.appendChild(right_div);
    card_span.appendChild(right_div_wrapper);

    let non_right_div_wrapper = document.createElement("div");
    if (non_right_div) {
        non_right_div_wrapper.appendChild(non_right_div);
    }
    card_span.appendChild(non_right_div_wrapper);

    card_span.onclick = () => {
        if (previewingCard != null && previewingCard.card_span == card_span) {
            return;
        }
        if (previewingCard) {
            hidePreviewingCard();
        }
        const parent = card_span.parentElement;
        // create a empty card div of the same size
        const placeholder = document.createElement("div");
        placeholder.style.minWidth = card_span.getBoundingClientRect().width + "px";
        placeholder.style.minHeight = card_span.getBoundingClientRect().height + "px";
        parent.insertBefore(placeholder, card_span);
        card_span.style.top = `${card_span.getBoundingClientRect().top}px`;
        card_span.style.left = `${card_span.getBoundingClientRect().left}px`;
        card_span.style.position = "fixed";
        card_span.style.height = "70vh";
        card_span.style.zIndex = 100;
        right_div_wrapper.style.display = "block";
        non_right_div_wrapper.style.display = "none";
        requestAnimationFrame(() => {
            card_span.style.top = `calc(50% - ${card_span.getBoundingClientRect().height / 2}px)`;
            card_span.style.left = `calc(50% - ${card_span.getBoundingClientRect().width / 2}px)`;
            card_span.children[0].classList.remove(class_to_apply);
            card_span.children[0].classList.add("preview_card");
        });
        previewingCard = {
            card_span,
            placeholder,
            right_div_wrapper,
            class_to_apply,
            non_right_div_wrapper,
        };
    };

    return card_span;
}

function canIPlay() {
    return gamestate.activity_type == "playing" && gamestate.stage == IAM;
}

function canIDefend() {
    return gamestate.activity_type == "selectingDefender" && gamestate.stage == IAM;
}

function renderHand() {
    previewingCard = null;
    player_cards.innerHTML = "";
    for (let card of gamestate.hands[IAM]) {
        let right_div = document.createElement("div");
        if (canIPlay()) {
            if (card.mana_cost <= gamestate.mana_counts[IAM]) {
                const playButton = document.createElement("button");
                playButton.innerHTML = `
                Play (${card.mana_cost} mana)
                `;
                playButton.onclick = async () => {
                    gamestate.hands[IAM] = gamestate.hands[IAM].filter(c => c != card);
                    card.tapped = false;
                    gamestate.battlefields[IAM].push(card);
                    gamestate.mana_counts[IAM] -= card.mana_cost;
                    renderAll();
                    await uploadGamestate();
                };
                right_div.appendChild(playButton);
            } else {
                right_div.innerHTML = `
                <span style="color: red;">Not enough mana to play (${card.mana_cost} mana)</span>
                `;
            }
        }
        const card_elm = createCardElm(card, right_div, "hand_card");
        player_cards.appendChild(card_elm);
    }
}

function getEnemy() {
    return IAM == "p1" ? "p2" : "p1";
}

function renderBattlefield(player) {
    const battlefield = player == IAM ? player_battlefield : opponent_battlefield;
    battlefield.innerHTML = "";
    for (let card of gamestate.battlefields[player]) {
        let right_div = document.createElement("div");
        getActionsForCard(card).forEach(action => {
            const actionButton = document.createElement("button");
            actionButton.innerHTML = action.name;
            actionButton.onclick = action.onclick;
            right_div.appendChild(actionButton);
        });
        let non_right_div = document.createElement("div");
        non_right_div.innerHTML = `
        <div style="
            position: absolute;
            bottom: 5;
            left: 40;
            background-color: wheat;
        ">${card.power} / ${card.HP}</div>
        `;
        const card_elm = createCardElm(card, right_div, "battlefield_card", non_right_div);
        if (card.fighting) {
            card_elm.style.border = "2px solid red";
        }
        if (card.defending) {
            card_elm.style.border = "2px solid green";
        }
        battlefield.appendChild(card_elm);
    }
}

async function downloadGamestate() {
    const newGamestate = await getServerKey("gamestate");
    const gamestateChanged = JSON.stringify(gamestate) !== JSON.stringify(newGamestate);
    gamestate = newGamestate;
    return gamestateChanged;
}

async function uploadGamestate() {
    await setServerKey("gamestate", gamestate);
}

async function waitForStage(stage) {
    while (gamestate.stage != stage) {
        await downloadGamestate();
    }
}

async function waitForStageAndRender(stage) {
    while (true) {
        if (gamestate.stage == stage)
        {
            break;
        }
        const changed = await downloadGamestate();
        if (changed) {
            renderAll();
        }
    }
}

async function join_game(player) {
    IAM = player;

    await downloadGamestate();

    if (gamestate.stage == "waitingForPlayerTwo") {
        if (player == "p1") {
            alert("You are player 1, please create a new game since there is no ongoing game");
            return;
        } else {
            gamestate = getInitialGamestate();
            await uploadGamestate();
        }
    }
    renderAll();
    waitForStageAndRender(IAM);
    showScreen("gameMenu");
}
