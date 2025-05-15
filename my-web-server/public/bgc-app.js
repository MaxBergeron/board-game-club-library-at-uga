const folderPath = 'entries\\';

 // Select the .entry element
 document.addEventListener('DOMContentLoaded', () => {

  // Container where the entries will be appended
  const container = document.querySelector('.library');

  const filenames = "5_Minute_Dungeon.xml,7_Wonders.xml,Afterworld.xml,Aggravation.xml,Anomia.xml,Bananagrams.xml,Battleship.xml,Betrayal_at_Baldur_s_Gate.xml,Betrayal_at_House_on_the_Hill.xml,Blockbuster.xml,Blokus.xml,Blood_on_the_Clocktower.xml,Boggle.xml,Candy_Land.xml,Carcassonne.xml,Cards_Against_Humanity.xml,CATAN.xml,Catan__Family_Edition.xml,Chutes_and_Ladders.xml,Circadians__First_Light.xml,Clank___A_Deck_Building_Adventure.xml,Checkers.xml,Chess.xml,Codenames.xml,Cockroach_Poker.xml,Coup.xml,Connect_Four.xml,Deadwood_1876.xml,Dice_Hospital.xml,Dice_Settlers.xml,Don_t_Mix_It_.xml,Donner_Dinner_Party.xml,Doomlings.xml,Double_Bananagrams.xml,Dragonwood.xml,Dungeon_.xml,Dutch_Blitz.xml,Escape_Room.xml,Evolution__The_Beginning.xml,Exploding_Kittens.xml,Fakin__It_.xml,Five_Crowns.xml,Forbidden_Island.xml,Galactiquest.xml,Gentes.xml,Guess_Who_.xml,Herbaceous.xml,Here_to_Slay.xml,High_Hand.xml,Hollywood_1947.xml,How_to_Rob_a_Bank.xml,Inis.xml,Jenga.xml,Kalah.xml,King_of_Tokyo.xml,Legendary__A_Marvel_Deck_Building_Game.xml,Love_Letter.xml,Magic__The_Gathering___Arena_of_the_Planeswalkers.xml,Minecraft_Card_Game_.xml,Monopoly.xml,Monopoly_Speed.xml,Munchkin_Apocalypse.xml,Mysterium.xml,One_Night_Ultimate_Werewolf.xml,Operation.xml,Phase_10.xml,Pictionary__2013_edition_.xml,Poetry_for_Neanderthals.xml,Pot_de_Vin.xml,Quoridor.xml,Risk.xml,Rummikub.xml,Root.xml,Salem_1692.xml,Scrabble.xml,Secret_Hitler.xml,Sequence.xml,Sorry_.xml,Sorry__Sliders.xml,Space_Gate_Odyssey.xml,Taboo.xml,Tacocat_Spelled_Backwards.xml,The_Chameleon.xml,The_Game_of_Life__2013__Editions_.xml,The_Oregon_Trail_Card_Game.xml,Throw_Throw_Burrito.xml,Ticket_to_Ride.xml,Trial_by_Trolley.xml,Trivial_Pursuit__Classic_Edition.xml,Tortuga_1667.xml,Trouble.xml,Two_Rooms_and_a_Boom.xml,UNO.xml,Yahtzee.xml";
  const filenamesArray = filenames.split(',');

  // Number of copies to create
  const copies = filenamesArray.length;

  const entry = document.querySelector('.entry');

  for (let i = 0; i < copies; i++) {

    // Clone the entry element
    const clone = entry.cloneNode(true);
    clone.classList.remove('template'); // make clone visible
    const fileUrl = `http://localhost:3000/entries/${filenamesArray[i]}`;
    fetch(fileUrl)
      .then(response => {
        if(!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(str => {
        // Parse the XML string into an XML document
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, 'application/xml');  
        console.log(xmlDoc);
        const elements = document.querySelectorAll('.boardGameName');
        
        // assign name
        const name = xmlDoc.querySelector('name[type="primary"]').getAttribute('value');
        clone.querySelector('.boardGameName').textContent = name;

        // assign image
        const image = xmlDoc.querySelector('image').textContent;
        clone.querySelector('img.images').src = image;

        // assign number of players 
        const minPlayers = xmlDoc.querySelector('minplayers').getAttribute('value');
        const maxPlayers = xmlDoc.querySelector('maxplayers').getAttribute('value');
        clone.querySelector('.playerCount').textContent = 'Number of Players: ' + minPlayers + '-' + maxPlayers;

        // assign play time 
        const playTime = parseFloat(xmlDoc.querySelector('playingtime').getAttribute('value'));
        if(playTime !== 0) {
        clone.querySelector('.playTime').textContent = `Play Time: ${playTime}` + ' Min';
        }

        // assign weight 
        const weight = parseFloat(xmlDoc.querySelector('averageweight').getAttribute('value'));
        if (weight !== 0) {
        const limitedWeight = Math.round(weight * 100) / 100;
        clone.querySelector('.weight').textContent = `Weight: ${limitedWeight}` + '/5';
        }
        // assign rating
        const rating = parseFloat(xmlDoc.querySelector('average').getAttribute('value'));
        const limitedRating = Math.round(rating * 100) / 100;
        clone.querySelector('.averageRating').textContent = `Average Rating: ${limitedRating}` + '/10';

      // assing release year
        const yearReleased = parseFloat(xmlDoc.querySelector('yearpublished ').getAttribute('value'));
        if (yearReleased !== 0) {
        clone.querySelector('.yearReleased').textContent = `Year Released: ${yearReleased}`;
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
     });   
    // Append the clone to the container
    container.appendChild(clone);
    }
  });

