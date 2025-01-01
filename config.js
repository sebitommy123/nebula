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
    {image: "Terrible Terror.png"},
    {image: "Tidalox.png"},
    {image: "Gravlok.png"},
];

let list_of_cards_2 = [
    {image: "Terrible Terror.png"},
    {image: "Tidalox.png"},
    {image: "Gravlok.png"},
]

let list_of_cards_3 = [
    {image: "Tidalox.png"},
]

const EXTRA_DUMBASS_FEATURE = true;

function get_deck_for_player(username) {
    let deck = [];
    for (let i = 0; i < 40; i++) {
        let card = list_of_cards[Math.floor(Math.random() * list_of_cards.length)];
        deck.push({...card});
    }
    return deck;
}

function get_shop_deck_1() {
    let deck = [];
    for (let i = 0; i < 40; i++) {
        let card = list_of_cards_2[Math.floor(Math.random() * list_of_cards_2.length)];
        deck.push({...card});
    }
    deck = randomize_deck(deck);
    return deck;
}

function get_shop_deck_2() {
    let deck = [];
    for (let i = 0; i < 40; i++) {
        let card = list_of_cards_3[Math.floor(Math.random() * list_of_cards_3.length)];
        deck.push({...card});
    }
    deck = randomize_deck(deck);
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
        if (deck.length == 0) {
            break;
        }
        hand.push(deck.pop());
    }
    return hand;
}

function get_initial_shop_1(deck) {
    let shop = [];
    for (let i = 0; i < 4; i++) {
        shop.push(deck.pop());
    }
    return shop;
}

function get_initial_shop_2(deck) {
    let shop = [];
    for (let i = 0; i < 2; i++) {
        shop.push(deck.pop());
    }
    return shop;
}

function getInitialGamestate() {
    let player_1_deck = get_deck_for_player("<template1>");
    let player_2_deck = get_deck_for_player("<template2>");
    player_1_deck = randomize_deck(player_1_deck);
    player_2_deck = randomize_deck(player_2_deck);

    if (EXTRA_DUMBASS_FEATURE) {
        player_1_deck = ["Terrible Terror.png"];
        player_2_deck = ["Tidalox.png"];
        player_1_deck = player_1_deck.map(img => ({...list_of_cards.find(c => c.image == img)}));
        player_2_deck = player_2_deck.map(img => ({...list_of_cards.find(c => c.image == img)}));
    }

    let shop_deck_1 = get_shop_deck_1();
    let shop_deck_2 = get_shop_deck_2();
    return {
        stage: "p1",
        decks: {
            "p1": player_1_deck,
            "p2": player_2_deck,
        },
        extra_deck: [],
        shop_deck_1: shop_deck_1,
        shop_deck_2: shop_deck_2,
        shop_1: get_initial_shop_1(shop_deck_1),
        shop_2: get_initial_shop_2(shop_deck_2),
        hands: {
            "p1": get_initial_hand(player_1_deck),
            "p2": get_initial_hand(player_2_deck),
        },
        activity_type: "playing",
        battlefields: {
            "p1": [],
            "p2": [],
        },
        counts: {
            mana: {"p1": 1000, "p2": 1000},
            coins: {"p1": 0, "p2": 0},
            life: {"p1": 1000, "p2": 1000},
        },
        fightingScene: null,
    };
}

function getDefaultText() {
    return `
Attack: default
Defense: default
Poisoned: no
    `;
}

const hideForEnemy = ["mana", "coins"];