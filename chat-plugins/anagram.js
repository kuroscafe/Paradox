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
	for (var i = pokemonName.length; i > 0; i--) {
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
}

exports.commands = {
	anagram: {
		start: 'create',
		new: 'create',
		create: function (target, room, user) {
			if (!this.can('makechatroom')) return false;
			if (!this.canTalk()) return this.errorReply('You cannot do this while unable to talk.');
			if (room.chatRoomData.anagramWord) return this.add('|raw|<center>Pokémon: ' + room.chatRoomData.shuffledAnagramWord + '</center>');
			if (!room.chatRoomData.anagram) room.chatRoomData.anagram = true;
			if (!room.chatRoomData.anagramWord) room.chatRoomData.anagramWord = getPoke();
			if (!room.chatRoomData.shuffledAnagramWord) room.chatRoomData.shuffledAnagramWord = shuffle(room.chatRoomData.anagramWord);
			this.add('|raw|<div class="broadcast-green">A game of anagram has started, use /guessanagram [pokémon] or /gan [pokémon] to guess the Pokémon.</div>');
			this.add('|raw|<center>Pokémon: ' + room.chatRoomData.shuffledAnagramWord + '</center>');

			room.chat = function (user, message, connection) {
				if (room.chatRoomData.anagramWord === toId(message)) message = '/gan ' + message;
				message = CommandParser.parse(message, this, user, connection);

				if (message && message !== true) {
					this.add('|c|' + user.getIdentity(this.id) + '|' + message);
				}
				this.update();
			}

			return this.privateModCommand("(A game of anagram was started by " + user.name + ".)");
		},
		stop: 'end',
		end: function (target, room, user) {
			if (!this.can('makechatroom')) return false;
			if (!this.canTalk()) return this.errorReply('You cannot do this while unable to talk.');
			if (!room.chatRoomData.anagram) return this.errorReply('There is no game of anagram running in this room.');
			if (room.chatRoomData.anagram) {
				endAnagram(room.chatRoomData);
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
		if (!room.chatRoomData.anagram) return this.errorReply('There is no game of anagram running in this room.');

		let word = room.chatRoomData.anagramWord;

		if (toId(target) === word) {
			endAnagram(room.chatRoomData);
			Db('money').set(user.userid, Db('money').get(user.userid, 0) + 1);
			if (Users.get(user.userid)) Users(user.userid).popup('You have been awarded with a buck for winning the game of anagram.');
			return this.add('|raw|<div class="broadcast-green">The Pokémon has been guessed. Congratulations to ' + user.name + ' for guessing correctly!</div>');
		} else {
			return this.sendReply('Incorrect guess!');
		}
	},
};