console.log('Hello World');
let Main_Menu_div = document.getElementById("Main_Menu");
let Loading_Menu_div = document.getElementById("Loading_Menu");
let Game_Menu_div = document.getElementById("Game_Menu");
let Player_Cards_div = document.getElementById("player_cards");
let player_battlefield_div = document.getElementById("player_battlefield");
let opponent_battlefield_div = document.getElementById("opponent_battlefield");
let deck_and_next_turn_div = document.getElementById("deck_and_next_turn");
let resources_bar = document.getElementById("resources_bar");

let IAM = null;
let gamestate = null;

async function game_launch() {
    IAM = "p1";
    console.log('Game launched');

    Main_Menu_div.style.display = "none";
    Loading_Menu_div.style.display = "block";

    await setServerKey("gamestate", {isnull: true});

    while (true) {
        if ((await getServerKey("gamestate")).isnull == false)
        {
            break;
        }
    }

    gamestate = await getServerKey("gamestate");
    console.log("Gamestate is not null");
    Loading_Menu_div.style.display = "none";
    Game_Menu_div.style.display = "block";

    render_cards();
    render_battlefield("p1");
    render_battlefield("p2");
    render_next_turn_button();

    /*
    await getServerKey("gamestate"); 

    let v = {"lmao": 42};
    await setServerKey("gamestate", {
        myCards: [{
            name: "asd",
        }], 
    });
    */

}

let common_abilities = [
    {
        name: "ability 1",
        description: "description 1",
    },
    {
        name: "ability 2",
        description: "description 2",
    },
]

let modifiers = [
    {
        name: "modifier 1",
        description: "description 1",
    },
    {
        name: "modifier 2",
        description: "description 2",
    },
]

let list_of_cards = [
    {
        name: "Card 1",
        image: "Terrible Terror.png",
        elements: ["element 1", "element 2"],
        card_type: "type 1",
        mana_cost: 1,
        rarity: "common",
        power: 40,
        HP: 130,
        active_abilities: [
            {
            },
            {

            }
        ],
        passive_abilities: [
            {
            },
            {

            }
        ],
        common_abilities: ["ability 1", "ability 2"],
    },
    {
        name: "Card 2",
        image: "Tidalox.png",
        elements: ["element 1", "element 2"],
        card_type: "type 1",
        mana_cost: 1,
        rarity: "common",
        power: 200,
        HP: 280,
        active_abilities: [
            {
            },
            {

            }
        ],
        passive_abilities: [
            {
            },
            {

            }
        ],
        common_abilities: ["ability 1", "ability 2"],
    },
    {
        name: "Card 3",
        image: "Gravlok.png",
        elements: ["element 1", "element 2"],
        card_type: "type 1",
        mana_cost: 1,
        rarity: "common",
        power: 50,
        HP: 200,
        active_abilities: [
            {
            },
            {

            }
        ],
        passive_abilities: [
            {
            },
            {

            }
        ],
        common_abilities: ["ability 1", "ability 2"],
    },
];

async function game_load() {
    IAM = "p2";
    console.log('Game loaded');
    let player_1_deck = get_deck();
    let player_2_deck = get_deck();
    let turn = "p1";
    gamestate = {
        isnull: false,
        player_1_deck: player_1_deck,
        player_1_hand: get_initial_hand(player_1_deck),
        player_2_deck: player_2_deck,
        player_2_hand: get_initial_hand(player_2_deck),
        turn: turn,
        player_1_battlefield: [],
        player_2_battlefield: [],
        player_1_mana_tally: 0,
        player_2_mana_tally: 0,
        player_1_coin_tally: 0,
        player_2_coin_tally: 0,
    };
    await setServerKey("gamestate", gamestate);
    Main_Menu_div.style.display = "none";
    Game_Menu_div.style.display = "block";
    render_cards();
    download_gamestate();
    render_battlefield("p1");
    render_battlefield("p2");
    render_next_turn_button();
}

async function download_gamestate() {
    while (is_it_my_turn() == false) {
        let new_gamestate = await getServerKey("gamestate");
        if (are_jsons_equal(gamestate, new_gamestate) == false) {
            gamestate = new_gamestate;
            render_battlefield("p1");
            render_battlefield("p2");
            render_next_turn_button();
        }
    }
}

function are_jsons_equal(json1, json2) {
    return JSON.stringify(json1) == JSON.stringify(json2);
}

function is_it_my_turn() {
    return gamestate.turn == IAM;
}

function get_deck() {
    let deck = [];
    for (let i = 0; i < 40; i++) {
        let card = list_of_cards[Math.floor(Math.random() * list_of_cards.length)];
        deck.push({...card});
    }
    return randomize_deck(deck);
}

function randomize_deck(deck){
    let new_deck = [];
    while (deck.length > 0) {
        let index = Math.floor(Math.random() * deck.length);
        new_deck.push(deck[index]);
        deck.splice(index, 1);
    }
    return new_deck;
} 

function get_initial_hand(deck) {
    let hand = [];
    for (let i = 0; i < 15; i++) {
        hand.push(deck.pop());
    }
    return hand;
}

async function render_mana_tally() {
    let mana_tally = null;
    let coin_tally = null;
    if (IAM == "p1") {
        mana_tally = gamestate.player_1_mana_tally;
        coin_tally = gamestate.player_1_coin_tally;
    }
    else {
        mana_tally = gamestate.player_2_mana_tally;
        coin_tally = gamestate.player_2_coin_tally;
    } // add mana image and coin image
    resources_bar.innerHTML = ` 
    <img src="images/mana.png" alt="Mana Image" style="height:5vh"> ${mana_tally}
    <img src="images/coin.png" alt="Coin Image" style="height:5vh"> ${coin_tally}
    `;






async function render_battlefield(player) {
    let battlefield = null;
    if (player == "p1") {
        battlefield = gamestate.player_1_battlefield;
    }
    else {
        battlefield = gamestate.player_2_battlefield;
    }
    let the_div = null;
    if (player == IAM) {
        the_div = player_battlefield_div;
    }
    else {
        the_div = opponent_battlefield_div;
    }
    the_div.innerHTML = "";
    for (let card of battlefield) {
        let card_span = document.createElement("span");
        card_span.innerHTML = `
        <img src="images/${card.image}" alt="Card Image" style="height:22vh" class="battlefieldcard">
        `;
        the_div.appendChild(card_span);
    }        
}

async function change_turn() {
    if (gamestate.turn == "p1") {
        gamestate.turn = "p2";
    }
    else {
        gamestate.turn = "p1";
    }
    render_next_turn_button();
    await setServerKey("gamestate", gamestate);
    download_gamestate();
}

async function render_next_turn_button() {
    let button = document.createElement("button");
    button.innerHTML = "Next Turn";
    button.onclick = async function() {
        if (is_it_my_turn() == false) {
            alert("It is not your turn");
            return;
        }
        change_turn();
    }
    deck_and_next_turn_div.innerHTML = "";
    deck_and_next_turn_div.appendChild(button);
    if (is_it_my_turn() == false) {
        button.disabled = true;
    }
}



async function render_cards() {
    let hand = null;
    if (IAM == "p1") {
        hand = gamestate.player_1_hand;
    }
    else {
        hand = gamestate.player_2_hand;
    }
    Player_Cards_div.innerHTML = ""; 
    for (let card of hand) {
        let card_span = document.createElement("span");
        card_span.innerHTML = `
        <img src="images/${card.image}" alt="Card Image" style="height:22vh" class="card">
        `;
        function select_card() {
            if (is_it_my_turn() == false) {
                alert("It is not your turn");
                return;
            }
            let approval = confirm("Do you want to play this card?");
            if (approval == true) {
                console.log("Card selected");
                if (IAM == "p1") {
                    gamestate.player_1_hand.splice(gamestate.player_1_hand.indexOf(card), 1);
                    gamestate.player_1_battlefield.push(card);
                }
                else {
                    gamestate.player_2_hand.splice(gamestate.player_2_hand.indexOf(card), 1);
                    gamestate.player_2_battlefield.push(card);
                }
                setServerKey("gamestate", gamestate);
                render_cards();
                render_battlefield("p1");
                render_battlefield("p2");
            }
        }
        card_span.onclick = select_card;
        Player_Cards_div.appendChild(card_span);
    }
}