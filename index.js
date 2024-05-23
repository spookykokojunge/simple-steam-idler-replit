const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const keep_alive = require('./keep_alive.js');

var username = process.env.username;
var password = process.env.password;
var shared_secret = process.env.shared;

var games = [730, 440, 570];  // AppIDs of the needed games
var status = 1;  // 1 - online, 7 - invisible
var customGame = "My Custom Game";  // The custom game name

var switchInterval = 30000;  // Time in milliseconds between switching games (e.g., 30000ms = 30 seconds)

const user = new steamUser();
user.logOn({
    "accountName": username,
    "password": password,
    "twoFactorCode": steamTotp.generateAuthCode(shared_secret)
});

user.on('loggedOn', () => {
    if (user.steamID != null) console.log(user.steamID + ' - Successfully logged on');
    user.setPersona(status);               
    switchGames();
});

function switchGames() {
    // Start with the custom game
    user.gamesPlayed([{ "game_id": "0", "game_extra_info": customGame }]);
    console.log('Playing custom game: ' + customGame);

    setTimeout(() => {
        // Switch to actual games
        user.gamesPlayed(games);
        console.log('Playing actual games: ' + games.join(', '));

        setTimeout(() => {
            // Call the function recursively to switch back to the custom game
            switchGames();
        }, switchInterval);
    }, switchInterval);
}
