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
    {image: "Abysswalker.png"},
    {image: "Aequartz.png"},
    {image: "Ankaris.png"},
    {image: "Aquapelor.png"},
    {image: "Ashrise.png"},
    {image: "Astrostar.png"},
    {image: "Bambrawl.png"},
    {image: "Bankgeist.png"},
    {image: "Basalraith.png"},
    {image: "Bawk Bawk.png"},
    {image: "Black Hound.png"},
    {image: "Brainspire.png"},
    {image: "Bramblegeist.png"},
    {image: "Brambletide.png"},
    {image: "Brassheart.png"},
    {image: "Brinecaller.png"},
    {image: "Bristle.png"},
    {image: "Carl.png"},
    {image: "Clattercoil.png"},
    {image: "Cobblejack.png"},
    {image: "Coralith.png"},
    {image: "Crustrox.png"},
    {image: "Diogenes.png"},
    {image: "Drudge.png"},
    {image: "Eugenio.png"},
    {image: "Frostbite.png"},
    {image: "Frystalon.png"},
    {image: "Fynduin.png"},
    {image: "Germaul.png"},
    {image: "Glaciris.png"},
    {image: "Glacora.png"},
    {image: "Glidd.png"},
    {image: "Gliding Eagle.png"},
    {image: "Goldfang.png"},
    {image: "Gravaron.png"},
    {image: "Gravdrift.png"},
    {image: "Gravebound.png"},
    {image: "Gravlok.png"},
    {image: "Grimelda.png"},
    {image: "Grimroot.png"},
    {image: "Hero of Valor.png"},
    {image: "Infernoghoul.png"},
    {image: "Ironmaw.png"},
    {image: "Jebadiah.png"},
    {image: "Joggelnaught.png"},
    {image: "Kitcher.png"},
    {image: "Lithorath.png"},
    {image: "Lucky Sebi.png"},
    {image: "Lumifly.png"},
    {image: "Madillo.png"},
    {image: "Mcdoogel.png"},
    {image: "Mindbloom.png"},
    {image: "Mindfract.png"},
    {image: "Mockmarion.png"},
    {image: "Molthar.png"},
    {image: "Mosslurk.png"},
    {image: "Muldran.png"},
    {image: "Nested Serpent.png"},
    {image: "Nimbow.png"},
    {image: "Noxsnake.png"},
    {image: "Obskarn.png"},
    {image: "Oxis.png"},
    {image: "Petranova.png"},
    {image: "Pipo.png"},
    {image: "Pyrix.png"},
    {image: "Quarrix.png"},
    {image: "Rapid F.png"},
    {image: "Rockhorn.png"},
    {image: "Rootkin.png"},
    {image: "Rotweaver.png"},
    {image: "Runebore.png"},
    {image: "Sarralune.png"},
    {image: "Scorchscale.png"},
    {image: "Scorvith.png"},
    {image: "Skelly.png"},
    {image: "Stormstrider.png"},
    {image: "Sylphwing.png"},
    {image: "Tenebris.png"},
    {image: "Terrible Terror.png"},
    {image: "Thornox.png"},
    {image: "Threxar.png"},
    {image: "Tidalox.png"},
    {image: "Tiki Tiki.png"},
    {image: "Umbelon.png"},
    {image: "Verdant Elder.png"},
    {image: "Wisp.png"},
    {image: "Wraithcaller.png"},
    {image: "Wyrmflicker.png"},
    {image: "Fire Element.png"},
    {image: "Water Element.png"},
    {image: "Electric Element.png"},
    {image: "Earth Element.png"},
    {image: "Plant Element.png"},
    {image: "Ice Element.png"},
    {image: "Dragon Element.png"},
    {image: "Dark Element.png"},
    {image: "Light Element.png"}
];


let list_of_cards_2 = [
    {image: "First Aid Kit.png"},
    {image: "Antidote.png"},
    {image: "Antidote.png"},
    {image: "Antidote.png"},
    {image: "Mega Healing Potion.png"},
    {image: "Band-Aid.png"},
    {image: "Mindbloom Herb.png"},
    {image: "Defibrillator.png"},
    {image: "Defibrillator.png"},
    {image: "Shockbloom Petal.png"},
    {image: "Cold Packs.png"},
    {image: "Cold Packs.png"},
    {image: "Campfire.png"},
    {image: "Campfire.png"},
    {image: "Coffee.png"},
    {image: "Coffee.png"},
    {image: "Healing Potion.png"},
    {image: "Healing Potion.png"},
    {image: "Lenses.png"}
]

let list_of_cards_3 = [
    {image: "Victory Relic.png"},
    {image: "Victory Totem.png"},
    {image: "Victory Totem.png"},
    {image: "Victory Totem.png"},
    {image: "Mana Orb.png"},
    {image: "Gold Mine.png"},
    {image: "Mini Mech Turret.png"},
    {image: "Luck Cube.png"},
    {image: "Landmines.png"},
]

const EXTRA_DUMBASS_FEATURE = true;

function get_deck_for_player(username) {
    let deck = [];
    for (let i = 0; i < 100; i++) {
        let card = list_of_cards[Math.floor(Math.random() * list_of_cards.length)];
        deck.push({...card});
    }
    return deck;
}

function get_shop_deck_1() {
    let deck = [];
    for (let i = 0; i < 100; i++) {
        let card = list_of_cards_2[Math.floor(Math.random() * list_of_cards_2.length)];
        deck.push({...card});
    }
    deck = randomize_deck(deck);
    return deck;
}

function get_shop_deck_2() {
    let deck = [];
    for (let i = 0; i < 100; i++) {
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
    for (let i = 0; i < 6; i++) {
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

    if (EXTRA_DUMBASS_FEATURE) {
        player_1_deck = [
            "Dark Element.png",
            "Dark Element.png",
            "Dark Element.png",
            "Dark Element.png",
            "Dark Element.png",
            "Dark Element.png",
            "Dark Element.png",
            "Earth Element.png",
            "Earth Element.png",
            "Earth Element.png",
            "Earth Element.png",
            "Earth Element.png",
            "Water Element.png",
            "Water Element.png",
            "Water Element.png",
            "Water Element.png",
            "Water Element.png",
            "Tenebris.png",
            "Coralith.png",
            "Brainspire.png",
            "Clattercoil.png",
            "Aquapelor.png",
            "Astrostar.png",
            "Glacora.png",
            "Wisp.png",
            "Ironmaw.png",
            "Joggelnaught.png",
            "Gravebound.png",
            "Carl.png",
            "Wraithcaller.png",
            "Grimelda.png",
            "Black Hound.png",
            "Eugenio.png",
            "Mockmarion.png",
            "Rotweaver.png",
            "Skelly.png",
            "Grimroot.png",
            "Gravaron.png",
            "Petranova.png",
            "Lithorath.png",
            "Obskarn.png",
            "Madillo.png",
            "Runebore.png",
            "Gravlok.png",
            "Gravdrift.png",
            "Quarrix.png",
            "Oxis.png",
            "Drudge.png",
            "Fynduin.png",
            "Earth Element.png"
        ];
        player_2_deck = [
            "Light Element.png",
            "Light Element.png",
            "Light Element.png",
            "Light Element.png",
            "Light Element.png",
            "Light Element.png",
            "Light Element.png",
            "Ice Element.png",
            "Ice Element.png",
            "Ice Element.png",
            "Ice Element.png",
            "Plant Element.png",
            "Plant Element.png",
            "Plant Element.png",
            "Plant Element.png",
            "Plant Element.png",
            "Plant Element.png",
            "Plant Element.png",
            "Terrible Terror.png",
            "Tidalox.png",
            "Cobblejack.png",
            "Nested Serpent.png",
            "Muldran.png",
            "Bristle.png",
            "Sarralune.png",
            "Brambletide.png",
            "Noxsnake.png",
            "Goldfang.png",
            "Verdant Elder.png",
            "Thornox.png",
            "Rootkin.png",
            "Mosslurk.png",
            "Bawk Bawk.png",
            "Umbelon.png",
            "Frostbite.png",
            "Diogenes.png",
            "Glaciris.png",
            "Frystalon.png",
            "Tiki Tiki.png",
            "Jebadiah.png",
            "Glidd.png",
            "Hero of Valor.png",
            "Aequartz.png",
            "Mindfract.png",
            "Lumifly.png",
            "Ankaris.png",
            "Pipo.png",
            "Bankgeist.png",
            "Lucky Sebi.png",
            "Sylphwing.png"
        ];
        player_1_deck = randomize_deck(player_1_deck);
        player_2_deck = randomize_deck(player_2_deck);
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
            mana: {"p1": 5, "p2": 5},
            coins: {"p1": 4, "p2": 4},
            life: {"p1": 500, "p2": 500},
        },
        fightingScene: null,
    };
}

function getDefaultText() {
    return `
=> 
Att Boost: default
Mx HP Boost: default
Current HP: default
    `;
}

const hideForEnemy = ["mana", "coins"];

// I need to not hide mana or coins
// I need you to shuffle the deck before starting