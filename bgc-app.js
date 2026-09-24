 document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.library');
  const entryTemplate = document.querySelector('.entry.template');
  const sortDirectionButton = document.getElementById('sort-direction');

  const filenames = "5_Minute_Dungeon.xml,7_Wonders_Duel.xml,7_Wonders.xml,Afterworld.xml,Aggravation.xml,Anomia_2_0.xml,Anomia.xml,Assault_on_Doomrock.xml,Azul.xml,Bananagrams.xml,Battleship.xml,Betrayal__Deck_of_Lost_Souls.xml,Betrayal_at_Baldur_s_Gate.xml,Betrayal_at_House_on_the_Hill.xml,Blockbuster.xml,Blokus.xml,Blood_on_the_Clocktower.xml,Boggle.xml,Candy_Land.xml,Carcassonne.xml,Cards_Against_Humanity.xml,Catan__Family_Edition.xml,CATAN.xml,Cheating_Moth.xml,Checkers.xml,Chess.xml,Chutes_and_Ladders.xml,Circadians__First_Light.xml,Clank___A_Deck_Building_Adventure.xml,Clue__Scooby_Doo_50th_Anniversary_Edition.xml,Clue.xml,Cockroach_Poker.xml,Codenames.xml,Connect_Four.xml,Coup.xml,Deadwood_1876.xml,Dice_Hospital.xml,Dice_Settlers.xml,Dixit.xml,Dominion.xml,Don_t_Mix_It_.xml,Donner_Dinner_Party.xml,Doomlings.xml,Double_Bananagrams.xml,Dragonwood.xml,Dungeon_.xml,Dutch_Blitz.xml,Everdell.xml,Evolution__The_Beginning.xml,Exploding_Kittens__Party_Pack.xml,Fakin__It_.xml,Five_Crowns.xml,Flip_7.xml,Forbidden_Island.xml,Full_Throttle_.xml,Fundomino.xml,Galactiquest.xml,Gentes.xml,Giant_UNO.xml,Guess_Who_.xml,Head_Trip.xml,Herbaceous.xml,Here_to_Slay.xml,High_Hand.xml,Hollywood_1947.xml,Host_Your_Own_Escape_Room.xml,How_to_Rob_a_Bank.xml,Hungry_Hungry_Hippos.xml,Inis.xml,Jenga.xml,Journey__A_Quest_for_Galactic_Power.xml,Kalah.xml,King_of_Tokyo.xml,Legendary__A_Marvel_Deck_Building_Game.xml,Love_Letter.xml,Magic__The_Gathering___Arena_of_the_Planeswalkers.xml,Minecraft_Card_Game_.xml,Monopoly__Animal_Crossing___New_Horizons.xml,Monopoly_Speed.xml,Monopoly.xml,Munchkin_Apocalypse.xml,Mysterium.xml,Neighborhoodies.xml,One_Night_Ultimate_Werewolf.xml,Operation.xml,Outburst_.xml,Pachisi.xml,Pandemic.xml,Phase_10.xml,Pictionary__2013_edition_.xml,Pictures.xml,Poetry_for_Neanderthals.xml,Pot_de_Vin.xml,Quacks.xml,Quoridor.xml,Riichi_Mahjong.xml,Risk.xml,Root.xml,Rummikub.xml,Salem_1692.xml,Scattergories.xml,Scrabble.xml,Secret_Hitler.xml,Sequence.xml,Set_a_Watch.xml,Sheriff_of_Nottingham.xml,Skull.xml,Sorry__Sliders.xml,Sorry_.xml,Space_Gate_Odyssey.xml,Splendor.xml,Spyfall.xml,Taboo.xml,Tacocat_Spelled_Backwards.xml,Tapple.xml,Telestrations.xml,The_Chameleon.xml,The_Game_of_Life__2013__Editions_.xml,The_Oregon_Trail_Card_Game.xml,Throw_Throw_Burrito.xml,Ticket_to_Ride__Europe.xml,Ticket_to_Ride.xml,Time_s_Up_.xml,Tortuga_1667.xml,Tranquility.xml,Trial_by_Trolley.xml,Trivial_Pursuit__Classic_Edition.xml,Trouble.xml,Twister.xml,Ultimate_Werewolf__Extreme.xml,UNO_Flip_.xml,UNO.xml,Wallet.xml,Wavelength.xml,Werewords.xml,Wingspan.xml,Yahtzee.xml";  const filenamesArray = filenames.split(',');
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
        const minPlayers = Number(xmlDoc.querySelector('minplayers')?.getAttribute('value')) || 0;
        const maxPlayers = Number(xmlDoc.querySelector('maxplayers')?.getAttribute('value')) || 0;
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
  let sortDescendingDropdown = false;

  function applyDropdownSort() {
    const selected = sortSelect.value;

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
          sortDescendingDropdown
            ? b.rating - a.rating
            : a.rating - b.rating
        );
        break;

      case 'players':
        gamesData.sort((a, b) =>
          sortDescendingDropdown
            ? b.maxPlayers - a.maxPlayers ||
              b.minPlayers - a.minPlayers ||
              a.name.localeCompare(b.name)
            : a.maxPlayers - b.maxPlayers ||
              a.minPlayers - b.minPlayers ||
              a.name.localeCompare(b.name)
        );
        break;

      case 'time':
        gamesData.sort((a, b) =>
          sortDescendingDropdown
            ? b.playTime - a.playTime
            : a.playTime - b.playTime
        );
        break;

      case 'weight':
        gamesData.sort((a, b) =>
          sortDescendingDropdown
            ? b.weight - a.weight
            : a.weight - b.weight
        );
        break;

      case 'year':
        gamesData.sort((a, b) =>
          sortDescendingDropdown
            ? b.yearReleased - a.yearReleased
            : a.yearReleased - b.yearReleased
        );
        break;
    }

    renderEntries(gamesData);
  }

  sortSelect.addEventListener('change', () => {
    // A new category begins in ascending order.
    sortDescendingDropdown = false;
    sortDirectionButton.textContent = '▲';

    applyDropdownSort();
  });

  sortDirectionButton.addEventListener('click', () => {
    sortDescendingDropdown = !sortDescendingDropdown;

    sortDirectionButton.textContent =
      sortDescendingDropdown ? '▼' : '▲';

    applyDropdownSort();
  });

  // Im feeling lucky button
  const luckyButton = document.getElementById('im-feeling-lucky');
  luckyButton.addEventListener('click', () => {
    if (gamesData.length > 0) {
      const randomIndex = Math.floor(Math.random() * gamesData.length);
      const randomGame = gamesData[randomIndex];
      alert(`How about trying "${randomGame.name}"?`);
    } else {
      alert('No games available to choose from.');
    }
  });
});
