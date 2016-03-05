exports.BattleScripts = {
    init: function () {
        for (var species in this.data.Pokedex) {
            for (var stat in this.data.Pokedex[species].baseStats) {
                this.modData('Pokedex', species).baseStats[stat] = (this.data.Pokedex[species].baseStats[stat] <= 145) ? 5 : 150 - this.data.Pokedex[species].baseStats[stat];
            }
        }
    }
};
