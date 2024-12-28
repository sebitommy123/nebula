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
        mana_cost: 6,
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
        mana_cost: 13,
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
        mana_cost: 5,
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

function get_deck_for_player(username) {
    let deck = [];
    for (let i = 0; i < 40; i++) {
        let card = list_of_cards[Math.floor(Math.random() * list_of_cards.length)];
        deck.push({...card});
    }
    return deck;
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
    for (let i = 0; i < 5; i++) {
        hand.push(deck.pop());
    }
    return hand;
}

function getInitialGamestate() {
    let player_1_deck = get_deck_for_player("<template1>");
    let player_2_deck = get_deck_for_player("<template2>");
    player_1_deck = randomize_deck(player_1_deck);
    player_2_deck = randomize_deck(player_2_deck);
    return {
        stage: "p1",
        decks: {
            "p1": player_1_deck,
            "p2": player_2_deck,
        },
        hands: {
            "p1": get_initial_hand(player_1_deck),
            "p2": get_initial_hand(player_2_deck),
        },
        activity_type: "playing",
        battlefields: {
            "p1": [],
            "p2": [],
        },
        mana_counts: {
            "p1": 1000,
            "p2": 1000,
        },
        coin_counts: {
            "p1": 1000,
            "p2": 1000,
        },
        health_points: {
            "p1": 1000,
            "p2": 1000,
        },
        fightingScene: null,
    };
}

function getActionsForCard(card) {

    let actions = [];

    if (canIPlay()) {
        async function onAttackRequested() {
            if (gamestate.battlefields[getEnemy()].length == 0) {
                gamestate.health_points[getEnemy()] -= card.power;
            } else {
                await moveCardToFightingPosition(card);
                await askUserToSelectDefender();
            }
        }
        actions.push({
            name: "attack",
            onclick: onAttackRequested,
        });
    }

    if (canIDefend()) {
        if (!card.defending) {
            async function onDefendRequested() {
                await moveCardToDefendingPosition(card);
            }
            actions.push({
                name: "defend",
                onclick: onDefendRequested,
            });
        } else {
            async function onStopDefendingRequested() {
                await moveCardToHand(card);
            }
            actions.push({
                name: "stop defending",
                onclick: onStopDefendingRequested,
            });
        }
    }

    return actions;

}
