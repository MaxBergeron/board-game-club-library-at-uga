const fs = require('fs');
const path = require('path');
const axios = require('axios');
const xml2js = require('xml2js');


// Example board game ID (you can replace this with any valid BGG board game ID)
const boardGameId = 155821; // For example, "5 Minute Dungeon"

// BGG API URL
const apiUrl = `https://boardgamegeek.com/xmlapi2/thing?type=boardgame&stats=1&id=${boardGameId}`;
const baseUrl = "https://boardgamegeek.com/xmlapi2/thing?type=boardgame&stats=1&id=";


// The folder where you want to save the XML data
const entriesFolder = path.join(__dirname, 'entries');
console.log(entriesFolder);

function createFolder() {
    const fs = require('fs');

// Specify the folder path you want to create
const folderPath = './newFolder';

// Check if the folder already exists
if (!fs.existsSync(folderPath)) {
    // Create the folder
    fs.mkdirSync(folderPath);
    console.log(`Folder "${folderPath}" created successfully!`);
} else {
    console.log(`Folder "${folderPath}" already exists.`);
}
        }

 async function saveBoardGameData(gameIdsString) {
    // Split the string into an array of IDs
    const gameIds = gameIdsString.split(',');

    for (const id of gameIds) {
        try {
            // Construct the API URL for the current ID
            const apiUrl = `${baseUrl}${id}`;

            // Fetch XML data from the API
            const response = await axios.get(apiUrl);

            // Parse XML data into a JavaScript object
            const parser = new xml2js.Parser();
            parser.parseString(response.data, (err, result) => {
                if (err) {
                    console.error(`Error parsing XML for ID ${id}:`, err);
                    return;
                }

                // Extract the name of the game from the parsed XML object
                const gameName = result.items.item[0].name[0].$.value.replace(/[^a-zA-Z0-9]/g, '_');

                // Save the XML data into a file in that folder
                const filePath = path.join(entriesFolder, `${gameName}.xml`);
                fs.writeFileSync(filePath, response.data, 'utf8');

                console.log(`XML data for "${gameName}" saved to ${filePath}`);
            });

            // Wait for 1 second between requests to avoid rate-limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`Error fetching or saving the XML data for ID ${id}:`, error);
        }
    }
}

const games = [
    "5 Minute Dungeon", "Afterworld", "Aggravation", "Anomia", "Banagrams", "Battleship",
    "Betrayal at Baldur's Gate", "Betrayal at House on the Hill", "Blockbuster", "Blokus",
    "Blood On The Clocktower", "Boggle", "Candyland", "Carcassonne", "Cards Against Humanity",
    "Catan", "Catan (5-6 Player Expansion)", "Catan- Family Edition", "Chameleon", "Checkers",
    "Chess", "Chutes and Ladders", "Circadians- First Light", "Clank!", "Clue", "Cockroach Poker",
    "Codenames", "Connect 4", "Coup", "Deadwood 1876", "Dice Hospital", "Dice Hospital- Deluxe Add Ons",
    "Dice Settlers", "Dixit", "Don’t Mix It", "Donner Dinner Party", "Doomlings", "Doomlings",
    "Doomrock", "Double Bananagrams", "Double Bananagrams", "Dragonwood", "Dungeon!", "Dutch Blitz",
    "Escape Room", "Evolution- The Beginning", "Exploding Kittens", "Fakin' It", "Five Crowns",
    "Forbidden Island", "Galactic Quest", "Game of Life", "Gentes", "Guess Who", "Herbaceous",
    "Here To Slay", "High Hand", "Hollywood 1947", "How to Rob a Bank", "Inis", "Jenga", "King of Tokyo",
    "Legendary", "Love Letter", "Magic the Gathering- Planeswalkers", "Mancala", "Marvel- Champions",
    "Minecraft- Card Game", "Monopoly", "Monopoly Speed", "Munchkin Apocalypse", "Mysterium",
    "Nuke Your Friends", "One Night Ultimate Werewolf", "Operation", "Phase 10", "Pictionary",
    "Poetry for Neanderthals", "Pot de Vin", "Quoridor", "Risk", "Root", "Rummy-O", "Salem 1692",
    "Scrabble", "Secret Hitler", "Sequence", "Sorry", "Sorry! Sliders", "Space Gate Odyssey", "Taboo",
    "Tacocat Spelled Backwards", "The Game Of Life", "The Oregon Trail", "Throw Throw Burrito",
    "Ticket to Ride", "Tortuga 1667", "Trial By Trolley", "Trivial Pursuit: Classic Edition", "Trouble",
    "Two Rooms and a Boom", "Uno!", "Yahtzee"
];
const gamesWithIDs = '207830,68448,22475,2272,67877,27225,2425,228660,10547,272438,2453,240980,1293,5048,822,50381,13,147240,227072,2083,171,5432,264052,201808,1294,11971,178900,2719,131357,245197,218121,230267,37196,354018,219638,324413,149241,76322,933,1339,148203,425677,201248,172225,432327,1472,65244,266079,217780,4143,195314,299252,3144,370621,232079,155821,2452,70323,129437,277085,167698,2448,186265,1406,295824,112869,181304,147949,3737,1258,197641,312786,232078,624,181,237182,811,175549,320,188834,2375,313121,37196,266179,1111,333373,172307,205322,274533,9209,218530,282171,248702,1410,134352,2223,2243';
const smallGameWithIDs = '149241,4103'
saveBoardGameData(smallGameWithIDs);

const outputFile = path.join(__dirname, 'game_ids.txt');

async function fetchGameID(gameName) {
    try {
        const response = await axios.get(`https://boardgamegeek.com/xmlapi2/search`, {
            params: { query: gameName, type: 'boardgame' }
        });
        const xml = response.data;

        const idMatch = xml.match(/<item type="boardgame" id="(\d+)">/);
        if (idMatch) {
            const gameID = idMatch[1];
            return { name: gameName, id: gameID };
        } else {
            throw new Error('Game ID not found in response.');
        }
    } catch (error) {
        console.error(`Error fetching ID for "${gameName}":`, error.message);
        return { name: gameName, id: null };
    }
}

async function saveGameIDs() {
    const stream = fs.createWriteStream(outputFile, { flags: 'w' });

    for (const game of games) {
        const result = await fetchGameID(game);
        if (result.id) {
            stream.write(`${result.name}: ${result.id}\n`);
        } else {
            stream.write(`${result.name}: ID not found\n`);
        }
        console.log(`Processed: ${result.name}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }

    stream.end();
    console.log(`Game IDs saved to ${outputFile}`);
}

