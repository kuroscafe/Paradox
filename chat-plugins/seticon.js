'use strict';

var serverid = 'paradox';
var icons = {};
var fs = require('fs');
var request = require('request');
let color= require('../config/color');

function load () {
	fs.readFile('config/icons.json', 'utf8', function (err, file) {
		if (err) return;
		icons = JSON.parse(file);
	});
}
load();

function updateIcons() {
	fs.writeFileSync('config/icons.json', JSON.stringify(icons));

	var newCss = '/* ICONS START */\n';

	for (var name in icons) {
		newCss += generateCSS(name, icons[name]);
	}
	newCss += '/* ICONS END */\n';

	var file = fs.readFileSync('config/custom.css', 'utf8').split('\n');
	if (~file.indexOf('/* ICONS START */')) file.splice(file.indexOf('/* ICONS */'), (file.indexOf('/* ICONS END */') - file.indexOf('/* ICONS */')) + 1);
	fs.writeFileSync('config/custom.css', file.join('\n') + newCss);
	request('http://play.pokemonshowdown.com/customcss.php?server=' + serverid + '&invalidate', function callback(error, res, body) {
		if (error) return console.log('updateIcons error: ' + error);
	});
}
function generateCSS(name, icon) {
	var css = '';
	var rooms = [];
	name = toId(name);
	for (var room in Rooms.rooms) {
		if (Rooms.rooms[room].id === 'global' || Rooms.rooms[room].type !== 'chat' || Rooms.rooms[room].isPersonal) continue;
		rooms.push('#' + Rooms.rooms[room].id + '-userlist-user-' + name);
	}
	css = rooms.join(', ');
	css += '{\nbackground: url("' + icon + '") no-repeat right\n}\n';
	return css;
}

exports.commands = {
	customicon: 'icon',
	icon: function (target, room, user) {
		if (!this.can('pban')) return false;
		target = target.split(',');
		for (var u in target) target[u] = target[u].trim();
		if (!target[1]) return this.parse('/help icon');
		if (toId(target[0]).length > 19) return this.errorReply("Usernames are not this long...");
		if (target[1] === 'delete') {
			if (!icons[toId(target[0])]) return this.errorReply('/icon - ' + target[0] + ' does not have an icon.');
			delete icons[toId(target[0])];
			updateIcons();
			this.sendReply("You removed " + target[0] + "'s icon.");
			Rooms('staff').add(user.name + " removed " + target[0] + "'s icon.").update();
			this.privateModCommand("(" + target[0] + "'s icon was removed by " + user.name + ".)");
			if (Users(target[0]) && Users(target[0]).connected) Users(target[0]).popup(user.name + " removed your icon.");
			return;
		}

		this.sendReply("|raw|You have given <b><font color=" + color(Tools.escapeHTML(target[0])) + ">" + Tools.escapeHTML(target[0]) + "</font></b> an icon.");
		Rooms('staff').add('|raw|<b><font color="' + color(Tools.escapeHTML(target[0])) + '">' + Tools.escapeHTML(target[0]) + '</font> has received an icon from ' + Tools.escapeHTML(user.name) + '.</b>').update();
		this.privateModCommand("(" + target[0] + " has recieved icon: '" + target[1] + "' from " + user.name + ".)");
		icons[toId(target[0])] = target[1];
		updateIcons();
	},
	iconhelp: [
		"Commands Include:",
		"/icon [user], [image url] - Gives [user] an icon of [image url]",
		"/icon [user], delete - Deletes a user's icon"
		]
};
