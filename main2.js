
const resources_bar_p1 = document.getElementById("resources_bar_p1");
const resources_bar_p2 = document.getElementById("resources_bar_p2");
const opponent_battlefield = document.getElementById("opponent_battlefield");
const player_battlefield = document.getElementById("player_battlefield");
const player_cards = document.getElementById("player_cards");
const shop_div = document.getElementById("shop");
const next_turn_button = document.getElementById("next_turn_button");
const draw_button = document.getElementById("draw_button");
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
    renderResourceBar("p1");
    renderResourceBar("p2");
    renderHand();
    renderBattlefield("p1");
    renderBattlefield("p2");
    renderShop();
    if (canIPlay()) {
        next_turn_button.innerHTML = "Next turn";
        next_turn_button.disabled = false;
        draw_button.disabled = false;
    } else {
        next_turn_button.innerHTML = "Next turn";
        next_turn_button.disabled = true;
        draw_button.disabled = true;
    }
}

async function next_turn() {
    if (canIPlay()) {
        gamestate.stage = getEnemy();
        renderAll();
        await uploadGamestate();
        waitForStageAndRender(IAM);
    }
}

function renderResourceBar(player) {
    let resources_bar = player == "p1" ? resources_bar_p1 : resources_bar_p2;
    resources_bar.innerHTML = `
    <span style="margin-left: 10px; margin-right: 10px;">${player == "p1" ? "Player 1" : "Player 2"}</span>
    `;
    Object.keys(gamestate.counts).forEach(countName => {
        if (hideForEnemy.includes(countName) && player != IAM) {
            return;
        }
        const count = gamestate.counts[countName][player];
        const div = document.createElement("div");
        div.style.marginRight = "10px";
        div.innerHTML = `
        ${countName}: 
        `;
        const input = document.createElement("input");
        input.type = "number";
        input.value = count;
        if (canIPlay()) {
            input.disabled = false;
            input.onchange = async () => {
                gamestate.counts[countName][player] = input.value;
                renderResourceBar(player);
                await uploadGamestate();
            };
        } else {
            input.disabled = true;
        }
        div.appendChild(input);
        resources_bar.appendChild(div);
    });
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
            const playButton = document.createElement("button");
            playButton.innerHTML = `
            Play
            `;
            playButton.onclick = async () => {
                gamestate.hands[IAM] = gamestate.hands[IAM].filter(c => c != card);
                card.text = getDefaultText();
                gamestate.battlefields[IAM].push({...card});
                renderAll();
                await uploadGamestate();
            };
            right_div.appendChild(playButton);
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
        if (canIPlay()) {
            right_div.innerHTML = `
            <textarea style="height: 300px; width: 200px;">${card.text}</textarea>
            <br>
            <button class='save'>Save</button>
            <button class='delete'>Delete card</button>
            <button class='alternate'>Alternate owner</button>
            `;
            const saveButton = right_div.querySelector(".save");
            const textarea = right_div.querySelector("textarea");
            saveButton.onclick = async () => {
                card.text = textarea.value;
                renderAll();
                await uploadGamestate();
            }

            const deleteButton = right_div.querySelector(".delete");
            deleteButton.onclick = async () => {
                if (!confirm("FR?")) {
                    return;
                }
                gamestate.battlefields[player] = gamestate.battlefields[player].filter(c => c != card);
                gamestate.extra_deck.push({...card});
                renderAll();
                await uploadGamestate();
            }

            const alternateButton = right_div.querySelector(".alternate");
            alternateButton.onclick = async () => {
                gamestate.battlefields[player] = gamestate.battlefields[player].filter(c => c != card);
                gamestate.battlefields[player == "p1" ? "p2" : "p1"].push({...card});
                renderAll();
                await uploadGamestate();
            }
        } else {
            right_div.innerHTML = `
            <textarea disabled style="height: 300px; width: 200px;"
            >${card.text}</textarea>
            `;
        }
        let non_right_div = document.createElement("div");
        non_right_div.innerHTML = `
        <textarea disabled style="height: 150px; width: 100px; font-size: 8px;"
        >${card.text}</textarea>
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

async function draw() {
    if (!confirm("NBRUH YOU SUREAU ABOUT TAHT MATE?")) {
        return;
    }
    if (canIPlay()) {
        gamestate.hands[IAM].push(gamestate.decks[IAM].pop());
        renderAll();
        await uploadGamestate();
    }
}

function renderShop() {

    shop_div.innerHTML = "";
    for (let card of gamestate.shop_1) {
        let right_div = document.createElement("div");
        if (canIPlay()) {
            const buyButton = document.createElement("button");
            buyButton.innerHTML = `
            Buy
            `;
            buyButton.onclick = async () => {
                gamestate.shop_1 = gamestate.shop_1.filter(c => c != card);
                gamestate.shop_1.push(gamestate.shop_deck_1.pop());
                gamestate.hands[IAM].push({...card});
                renderAll();
                await uploadGamestate();
            };
            right_div.appendChild(buyButton);
        }
        const card_elm = createCardElm(card, right_div, "shop_card");
        shop_div.appendChild(card_elm);
    }

    const divider1 = document.createElement("div");
    divider1.innerHTML = "<hr>";
    shop_div.appendChild(divider1);

    for (let card of gamestate.shop_2) {
        let right_div = document.createElement("div");
        if (canIPlay()) {
            const buyButton = document.createElement("button");
            buyButton.innerHTML = `
            Buy
            `;
            buyButton.onclick = async () => {
                gamestate.shop_2 = gamestate.shop_2.filter(c => c != card);
                gamestate.shop_2.push(gamestate.shop_deck_2.pop());
                gamestate.hands[IAM].push({...card});
                renderAll();
                await uploadGamestate();
            };
            right_div.appendChild(buyButton);
        }
        const card_elm = createCardElm(card, right_div, "shop_card");
        shop_div.appendChild(card_elm);
    }

    const divider2 = document.createElement("div");
    divider2.innerHTML = "<hr>";
    shop_div.appendChild(divider2);

    for (let card of gamestate.extra_deck) {
        let right_div = document.createElement("div");
        if (canIPlay()) {
            const buyButton = document.createElement("button");
            buyButton.innerHTML = `
            Slap into hand
            `;
            buyButton.onclick = async () => {
                gamestate.hands[IAM].push({...card});
                renderAll();
                await uploadGamestate();
            };
            right_div.appendChild(buyButton);
        }
        const card_elm = createCardElm(card, right_div, "shop_card");
        shop_div.appendChild(card_elm);
    }

}
