 document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.library');
  const entryTemplate = document.querySelector('.entry.template');
  const sortDirectionButton = document.getElementById('sort-direction');

  const filenames = "7_Wonders_Duel.xml,Azul.xml,Betrayal__Deck_of_Lost_Souls.xml,Catan__Seafarers.xml,Cheating_Moth.xml,Clue__Scooby_Doo_50th_Anniversary_Edition.xml,Dominion.xml,Flip_7.xml,Full_Throttle_.xml,Giant_UNO.xml,Head_Trip.xml,Hungry_Hungry_Hippos.xml,Neighborhoodies.xml,Outburst_.xml,Pachisi.xml,Pandemic.xml,The_Quacks_of_Quedlinburg.xml,Riichi_Mahjong.xml,Sheriff_of_Nottingham.xml,Skull.xml,Tapple.xml,Telestrations.xml,Time_s_Up_.xml,Twister.xml,Ultimate_Werewolf__Extreme.xml,Wallet.xml,Wavelength.xml,Werewords.xml";  const filenamesArray = filenames.split(',');
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