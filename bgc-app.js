 document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.library');
  const entryTemplate = document.querySelector('.entry.template');

  let sortDescending1 = false;
  let sortDescending2 = false;
  let sortDescending3 = false;
  let sortDescending4 = false;
  let sortDescending5 = false;
  let sortDescending6 = false;

  const filenames = "5_Minute_Dungeon.xml,7_Wonders.xml,Afterworld.xml,Aggravation.xml,Assault_on_Doomrock.xml,Anomia_2_0.xml,Anomia.xml,Bananagrams.xml,Battleship.xml,Betrayal_at_Baldur_s_Gate.xml,Betrayal_at_House_on_the_Hill.xml,Blockbuster.xml,Blokus.xml,Blood_on_the_Clocktower.xml,Boggle.xml,Candy_Land.xml,Carcassonne.xml,Cards_Against_Humanity.xml,CATAN.xml,Catan__Family_Edition.xml,Chutes_and_Ladders.xml,Circadians__First_Light.xml,Checkers.xml,Chess.xml,Clank___A_Deck_Building_Adventure.xml,Clue.xml,Codenames.xml,Cockroach_Poker.xml,Coup.xml,Connect_Four.xml,Deadwood_1876.xml,Dice_Hospital.xml,Dice_Settlers.xml,Dixit.xml,Don_t_Mix_It_.xml,Donner_Dinner_Party.xml,Doomlings.xml,Double_Bananagrams.xml,Dragonwood.xml,Dungeon_.xml,Dutch_Blitz.xml,Everdell.xml,Evolution__The_Beginning.xml,Exploding_Kittens__Party_Pack.xml,Fakin__It_.xml,Five_Crowns.xml,Forbidden_Island.xml,Fundomino.xml,Galactiquest.xml,Gentes.xml,Guess_Who_.xml,Herbaceous.xml,Here_to_Slay.xml,High_Hand.xml,Hollywood_1947.xml,Host_Your_Own_Escape_Room.xml,How_to_Rob_a_Bank.xml,Inis.xml,Jenga.xml,Kalah.xml,King_of_Tokyo.xml,Legendary__A_Marvel_Deck_Building_Game.xml,Love_Letter.xml,Magic__The_Gathering___Arena_of_the_Planeswalkers.xml,Minecraft_Card_Game_.xml,Monopoly.xml,Monopoly_Speed.xml,Monopoly__Animal_Crossing__New_Horizons.xml,Munchkin_Apocalypse.xml,Mysterium.xml,One_Night_Ultimate_Werewolf.xml,Operation.xml,Phase_10.xml,Pictionary__2013_edition_.xml,Pictures.xml,Poetry_for_Neanderthals.xml,Pot_de_Vin.xml,Quoridor.xml,Risk.xml,Rummikub.xml,Root.xml,Salem_1692.xml,Scattegories.xml,Scrabble.xml,Secret_Hitler.xml,Sequence.xml,Set_A_Watch.xml,Sorry_.xml,Sorry__Sliders.xml,Space_Gate_Odyssey.xml,Splendor.xml,Spyfall.xml,Taboo.xml,Tacocat_Spelled_Backwards.xml,The_Chameleon.xml,The_Game_of_Life__2013__Editions_.xml,The_Oregon_Trail_Card_Game.xml,Throw_Throw_Burrito.xml,Ticket_To_Ride__Europe.xml,Ticket_to_Ride.xml,Trial_by_Trolley.xml,Trivial_Pursuit__Classic_Edition.xml,Tortuga_1667.Tranquility.xml,xml,Trouble.xml,UNO_Flip_.xml,UNO.xml,Wingspan.xml,Yahtzee.xml";
  const filenamesArray = filenames.split(',');

  const gamesData = [];

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

  Promise.all(filenamesArray.map(fetchGameData))
    .then(results => {
      gamesData.push(...results);
      renderEntries(gamesData);
    })
    .catch(error => {
      console.error('Error fetching game data:', error);
    });

  function renderEntries(dataArray) {
    container.innerHTML = '';

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

  // Sorting buttons
  document.querySelector('.sorting-links .linkName').addEventListener('click', e => {
    e.preventDefault();
    sortDescending1 = !sortDescending1;
    gamesData.sort((a, b) => sortDescending1 ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
    renderEntries(gamesData);
  });

  document.querySelector('.sorting-links .linkRating').addEventListener('click', e => {
    e.preventDefault();
    sortDescending2 = !sortDescending2;
    gamesData.sort((a, b) => sortDescending2 ? b.rating - a.rating : a.rating - b.rating);
    renderEntries(gamesData);
  });

  document.querySelector('.sorting-links .linkPlayers').addEventListener('click', e => {
    e.preventDefault();
    sortDescending3 = !sortDescending3;
    gamesData.sort((a, b) => sortDescending3 ? b.maxPlayers - a.maxPlayers : a.minPlayers - b.minPlayers);
    renderEntries(gamesData);
  });

  document.querySelector('.sorting-links .linkTime').addEventListener('click', e => {
    e.preventDefault();
    sortDescending4 = !sortDescending4;
    gamesData.sort((a, b) => sortDescending4 ? b.playTime - a.playTime : a.playTime - b.playTime);
    renderEntries(gamesData);
  });

  document.querySelector('.sorting-links .linkWeight').addEventListener('click', e => {
    e.preventDefault();
    sortDescending5 = !sortDescending5;
    gamesData.sort((a, b) => sortDescending5 ? b.weight - a.weight : a.weight - b.weight);
    renderEntries(gamesData);
  });

  document.querySelector('.sorting-links .linkYear').addEventListener('click', e => {
    e.preventDefault();
    sortDescending6 = !sortDescending6;
    gamesData.sort((a, b) => sortDescending6 ? b.yearReleased - a.yearReleased : a.yearReleased - b.yearReleased);
    renderEntries(gamesData);
  });

  // Search bar
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const filteredGames = gamesData.filter(game =>
      game.name.toLowerCase().includes(query)
    );
    renderEntries(filteredGames);
  });

  // Dropdown sorting setup
  const sortSelect = document.getElementById('sort-select');
  let lastSortOption = '';
  let sortDescendingDropdown = false;

  sortSelect.addEventListener('change', () => {
    const selected = sortSelect.value;

    if (selected === lastSortOption) {
      sortDescendingDropdown = !sortDescendingDropdown;
    } else {
      sortDescendingDropdown = false;
    }
    lastSortOption = selected;

    switch (selected) {
      case 'name':
        gamesData.sort((a, b) =>
          sortDescendingDropdown
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
        );
        break;
      case 'rating':
        gamesData.sort((a, b) =>
          sortDescendingDropdown ? a.rating - b.rating : b.rating - a.rating
        );
        break;
      case 'players':
        gamesData.sort((a, b) => {
          const aAvg = (parseInt(a.minPlayers) + parseInt(a.maxPlayers)) / 2;
          const bAvg = (parseInt(b.minPlayers) + parseInt(b.maxPlayers)) / 2;
          return sortDescendingDropdown ? bAvg - aAvg : aAvg - bAvg;
        });
        break;
      case 'time':
        gamesData.sort((a, b) =>
          sortDescendingDropdown ? b.playTime - a.playTime : a.playTime - b.playTime
        );
        break;
      case 'weight':
        gamesData.sort((a, b) =>
          sortDescendingDropdown ? b.weight - a.weight : a.weight - b.weight
        );
        break;
      case 'year':
        gamesData.sort((a, b) =>
          sortDescendingDropdown ? b.yearReleased - a.yearReleased : a.yearReleased - b.yearReleased
        );
        break;
      default:
        break;
    }

    renderEntries(gamesData);
  });
});