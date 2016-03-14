/**
 *
 * Anagram.js Made By Dragotic. (Original idea by jd)
 * Starts a game of anagram, utilizes origindb to award bucks.
 *
 */

'use strict';

function shuffle(string) {
	let shuffledString = '';
	let pokemonName = string.split('');
	for (let i = pokemonName.length; i > 0; i--) {
		let index = Math.floor(Math.random() * i);
		shuffledString += pokemonName[index];
		pokemonName.splice(index, 1);
	}
	return shuffledString;
}

function getPoke() {
	let pokemonNum = Math.floor(Math.random() * 720);
	let pokemon;

	for (let i in Tools.data.Pokedex) {
		let poke = Tools.getTemplate(i);
		if (poke.num === pokemonNum) {
			pokemon = poke.id;
			break;
		}
	}
	return pokemon;
}

function endAnagram(room) {
	delete room.anagram;
	delete room.anagramWord;
	delete room.shuffledAnagramWord;
	delete room.anagramRounds;
	delete room.anagramMaxRounds;
}

exports.commands = {
	anagram: {
		start: 'create',
		new: 'create',
		create: function (target, room, user) {
			if (!this.can('makechatroom')) return false;
			if (!this.canTalk()) return this.errorReply('You cannot do this while unable to talk.');
			if (!target && !room.anagram) target = 1;
			if (isNaN(target)) return this.errorReply('The rounds should be in numbers!');
			if (!room.anagram) room.anagram = true;
			if (!room.anagramWord) room.anagramWord = getPoke();
			if (room.shuffledAnagramWord && room.anagramRounds) return this.add('|raw|<center>Pokémon: ' + room.shuffledAnagramWord + '</center>');
			if (!room.shuffledAnagramWord) room.shuffledAnagramWord = shuffle(room.anagramWord);
			if (room.anagramWord === room.shuffledAnagramWord) room.shuffledAnagramWord = shuffle(room.anagramWord);
			if (!room.anagramRounds) room.anagramRounds = 1;
			if (!room.anagramMaxRounds) room.anagramMaxRounds = Number(target);
			if (room.anagramRounds === 1) {
				this.add('|raw|<div class="broadcast-green">A game of anagram for ' + room.anagramMaxRounds + ' round(s) has started, use /guessanagram [pokémon] or /gan [pokémon] to guess the Pokémon.</div>');
				this.add('|raw|<center>Pokémon: ' + room.shuffledAnagramWord + '</center>');
				this.privateModCommand("(A game of anagram was started by " + user.name + ".)");
			} else {
				this.add('|raw|<div class="broadcast-green">Anagrams!, Round: ' + room.anagramRounds + ', the pokémon is: ' + room.shuffledAnagramWord + '.');
			}

			room.chat = function (user, message, connection) {
				if (room.anagramWord === toId(message)) message = '/gan ' + message;
				message = CommandParser.parse(message, this, user, connection);

				if (message && message !== true) {
					this.add('|c|' + user.getIdentity(this.id) + '|' + message);
				}
				this.update();
			};
		},
		stop: 'end',
		end: function (target, room, user) {
			if (!this.can('makechatroom')) return false;
			if (!this.canTalk()) return this.errorReply('You cannot do this while unable to talk.');
			if (!room.anagram) return this.errorReply('There is no game of anagram running in this room.');
			if (room.anagram) {
				endAnagram(room);
			}

			this.add('(The game of anagram was ended.)');
			return	this.privateModCommand('(The game of anagram was ended by ' + user.name + '.)');
		},
		'': function (target, room, user) {
			this.parse('/anagram create');
		},
	},
	gan: 'guessanagram',
	guessanagram: function (target, room, user) {
		if (!this.canTalk()) return this.errorReply('You cannot do this while unable to talk.');
		if (!room.anagram) return this.errorReply('There is no game of anagram running in this room.');

		let word = room.anagramWord;

		if (toId(target) === word) {
			Db('money').set(user.userid, Db('money').get(user.userid, 0) + 1);
			if (Users.get(user.userid)) Users(user.userid).popup('You have been awarded with a buck for winning the game of anagram.');
			room.anagramRounds++;
			this.add('|raw|<div class="broadcast-green">The Pokémon was ' + room.anagramWord + '. Congratulations to ' + user.name + ' for guessing correctly!</div>');
			if (room.anagram && room.anagramRounds < room.anagramMaxRounds) {
				delete room.anagramWord;
				delete room.shuffledAnagramWord;
				this.parse('/anagram create');
			} else {
				endAnagram(room);
			}
		} else {
			return this.sendReply('Incorrect guess!');
		}
	},
	anagramhelp: ['Commands for anagram are:',
			'- /anagram - Creates a game of anagram for 1 round. Requires ~',
			'- /anagram create [rounds] - Creates games of anagram for specified rounds. Requires ~',
			'- /anagram end - Ends the game of anagram. Requires ~',
			'- /gan [pokémon] - Guesses the pokemon in the anagram.',
			'- User can also type in chat to guess the pokémon in the anagram.'],
};
