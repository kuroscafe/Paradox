exports.BattleScripts = {
    init: function () {
        for (var i in this.data.Pokedex) {
            var tier = null;
            var adjust = false;
            if (this.data.FormatsData[i]) tier = this.data.FormatsData[i].tier;
            if (!tier && this.data.Pokedex[i].baseSpecies) tier = this.data.FormatsData[toId(this.data.Pokedex[i].baseSpecies)].tier;
          
            switch (tier) {
            case 'Uber':
                adjust = true;
                break;
            }
          
            if (adjust) {
                for (var j in this.data.Pokedex[i].baseStats) {
                    if (this.data.Pokedex[i].baseStats[hp] === j && this.data.Pokedex[i].forme === "mega") {
                        pass;
                    } else {
                        this.modData('Pokedex', i).baseStats[j] = this.clampIntRange(this.data.Pokedex[i].baseStats[j] / 2 + 40, 1, 255);
                    }
                }
            }
        }
    }
};
