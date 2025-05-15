 // Select the .entry element
 document.addEventListener('DOMContentLoaded', () => {

  // Container where the entries will be appended
  const container = document.querySelector('.library');
  const entryTemplate = document.querySelector('.entry.template');
  let sortDescending = false;


  const filenames = "5_Minute_Dungeon.xml,7_Wonders.xml,Afterworld.xml,Aggravation.xml,Anomia.xml,Bananagrams.xml,Battleship.xml,Betrayal_at_Baldur_s_Gate.xml,Betrayal_at_House_on_the_Hill.xml,Blockbuster.xml,Blokus.xml,Blood_on_the_Clocktower.xml,Boggle.xml,Candy_Land.xml,Carcassonne.xml,Cards_Against_Humanity.xml,CATAN.xml,Catan__Family_Edition.xml,Chutes_and_Ladders.xml,Circadians__First_Light.xml,Clank___A_Deck_Building_Adventure.xml,Checkers.xml,Chess.xml,Codenames.xml,Cockroach_Poker.xml,Coup.xml,Connect_Four.xml,Deadwood_1876.xml,Dice_Hospital.xml,Dice_Settlers.xml,Don_t_Mix_It_.xml,Donner_Dinner_Party.xml,Doomlings.xml,Double_Bananagrams.xml,Dragonwood.xml,Dungeon_.xml,Dutch_Blitz.xml,Escape_Room.xml,Evolution__The_Beginning.xml,Exploding_Kittens.xml,Fakin__It_.xml,Five_Crowns.xml,Forbidden_Island.xml,Galactiquest.xml,Gentes.xml,Guess_Who_.xml,Herbaceous.xml,Here_to_Slay.xml,High_Hand.xml,Hollywood_1947.xml,How_to_Rob_a_Bank.xml,Inis.xml,Jenga.xml,Kalah.xml,King_of_Tokyo.xml,Legendary__A_Marvel_Deck_Building_Game.xml,Love_Letter.xml,Magic__The_Gathering___Arena_of_the_Planeswalkers.xml,Minecraft_Card_Game_.xml,Monopoly.xml,Monopoly_Speed.xml,Munchkin_Apocalypse.xml,Mysterium.xml,One_Night_Ultimate_Werewolf.xml,Operation.xml,Phase_10.xml,Pictionary__2013_edition_.xml,Poetry_for_Neanderthals.xml,Pot_de_Vin.xml,Quoridor.xml,Risk.xml,Rummikub.xml,Root.xml,Salem_1692.xml,Scrabble.xml,Secret_Hitler.xml,Sequence.xml,Sorry_.xml,Sorry__Sliders.xml,Space_Gate_Odyssey.xml,Taboo.xml,Tacocat_Spelled_Backwards.xml,The_Chameleon.xml,The_Game_of_Life__2013__Editions_.xml,The_Oregon_Trail_Card_Game.xml,Throw_Throw_Burrito.xml,Ticket_to_Ride.xml,Trial_by_Trolley.xml,Trivial_Pursuit__Classic_Edition.xml,Tortuga_1667.xml,Trouble.xml,Two_Rooms_and_a_Boom.xml,UNO.xml,Yahtzee.xml";
  const filenamesArray = filenames.split(',');

  // Array to hold all loaded game data
  const gamesData = [];

  // Function to fetch one game XML and return a parsed object with needed info
  function fetchGameData(filename) {
    const fileUrl = `/entries/${filename}`;
    return fetch(fileUrl)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(str => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, 'application/xml');

        // Extract data safely with fallback values
        const name = xmlDoc.querySelector('name[type="primary"]')?.getAttribute('value') || "Unknown";
        const image = xmlDoc.querySelector('image')?.textContent || "/images/defaultImage.jpg";
        const minPlayers = xmlDoc.querySelector('minplayers')?.getAttribute('value') || "N/A";
        const maxPlayers = xmlDoc.querySelector('maxplayers')?.getAttribute('value') || "N/A";
        const playTime = parseFloat(xmlDoc.querySelector('playingtime')?.getAttribute('value')) || 0;
        const weight = parseFloat(xmlDoc.querySelector('averageweight')?.getAttribute('value')) || 0;
        const rating = parseFloat(xmlDoc.querySelector('average')?.getAttribute('value')) || 0;
        const yearReleased = parseFloat(xmlDoc.querySelector('yearpublished')?.getAttribute('value')) || 0;

        return {
          name,
          image,
          minPlayers,
          maxPlayers,
          playTime,
          weight,
          rating,
          yearReleased
        };
      });
  }

  // Fetch all data in parallel
  Promise.all(filenamesArray.map(fetchGameData))
    .then(results => {
      gamesData.push(...results);
      renderEntries(gamesData); // render initially unsorted
    })
    .catch(error => {
      console.error('Error fetching game data:', error);
    });

  // Function to render entries
  function renderEntries(dataArray) {
    container.innerHTML = ''; // clear old entries

    dataArray.forEach(game => {
      const clone = entryTemplate.cloneNode(true);
      clone.classList.remove('template');

      clone.querySelector('.boardGameName').textContent = game.name;
      clone.querySelector('img.images').src = game.image;
      clone.querySelector('.playerCount').textContent = `Number of Players: ${game.minPlayers}-${game.maxPlayers}`;
      clone.querySelector('.playTime').textContent = game.playTime ? `Play Time: ${game.playTime} Min` : 'Play Time: N/A';
      clone.querySelector('.weight').textContent = game.weight ? `Weight: ${Math.round(game.weight * 100) / 100}/5` : 'Weight: N/A';
      clone.querySelector('.averageRating').textContent = `Average Rating: ${Math.round(game.rating * 100) / 100}/10`;
      clone.querySelector('.yearReleased').textContent = game.yearReleased ? `Year Released: ${game.yearReleased}` : 'Year Released: N/A';

      container.appendChild(clone);
    });
  }

  // sort by name
   document.querySelector('.sorting-links .linkName').addEventListener('click', e => {
    e.preventDefault();
    sortDescending = !sortDescending; // Toggle sorting order
    gamesData.sort((a, b) => sortDescending ? b.name.localeCompare(a.name) :  a.name.localeCompare(b.name));
    renderEntries(gamesData);
  });
  // sort by rating
  document.querySelector('.sorting-links .linkRating').addEventListener('click', e => {
    e.preventDefault();
    sortDescending = !sortDescending; // Toggle sorting order
    gamesData.sort((a, b) => sortDescending ? b.rating - a.rating : a.rating - b.rating);
    renderEntries(gamesData);
  });
   // sort by number of players
  document.querySelector('.sorting-links .linkPlayers').addEventListener('click', e => {
    e.preventDefault();
    sortDescending = !sortDescending; // Toggle sorting order
    gamesData.sort((a, b) => sortDescending ? b.maxPlayers - a.maxPlayers : b.minPlayers - a.minPlayers);
    renderEntries(gamesData);
  });
 // sort by play time
  document.querySelector('.sorting-links .linkTime').addEventListener('click', e => {
    e.preventDefault();
    sortDescending = !sortDescending; // Toggle sorting order
    gamesData.sort((a, b) => sortDescending ? b.playTime - a.playTime : a.playTime - b.playTime);
    renderEntries(gamesData);
  });
   // sort by weight
  document.querySelector('.sorting-links .linkWeight').addEventListener('click', e => {
    e.preventDefault();
    sortDescending = !sortDescending; // Toggle sorting order
    gamesData.sort((a, b) => sortDescending ? b.weight - a.weight : a.weight - b.weight);
    renderEntries(gamesData);
  });
   // sort by rating
  document.querySelector('.sorting-links .linkYear').addEventListener('click', e => {
    e.preventDefault();
    sortDescending = !sortDescending; // Toggle sorting order
    gamesData.sort((a, b) => sortDescending ? b.yearReleased - a.yearReleased : a.yearReleased - b.yearReleased);
    renderEntries(gamesData);
  });
  });

