exports.BattleScripts = {
    init: function () 
    {
        for (var i in this.data.Pokedex) 
        {
            if(this.modData('Pokedex', i).baseStats['hp']>145)
                this.modData('Pokedex', i).baseStats['hp']=5;
            else
                this.modData('Pokedex', i).baseStats['hp']=150-this.data.Pokedex[i].baseStats['hp'];
            if(this.modData('Pokedex', i).baseStats['atk']>145)
                this.modData('Pokedex', i).baseStats['atk']=5;
            else
                this.modData('Pokedex', i).baseStats['atk']=150-this.data.Pokedex[i].baseStats['atk'];
            if(this.modData('Pokedex', i).baseStats['def']>145)
                this.modData('Pokedex', i).baseStats['def']=5;
            else
                this.modData('Pokedex', i).baseStats['def']=150-this.data.Pokedex[i].baseStats['def'];
            if(this.modData('Pokedex', i).baseStats['spa']>145)
                this.modData('Pokedex', i).baseStats['spa']=5;
            else
                this.modData('Pokedex', i).baseStats['spa']=150-this.data.Pokedex[i].baseStats['spa'];
            if(this.modData('Pokedex', i).baseStats['spd']>145)
                this.modData('Pokedex', i).baseStats['spd']=5;
            else
                this.modData('Pokedex', i).baseStats['spd']=150-this.data.Pokedex[i].baseStats['spd'];
            if(this.modData('Pokedex', i).baseStats['spe']>145)
                this.modData('Pokedex', i).baseStats['spe']=5;
            else
                this.modData('Pokedex', i).baseStats['spe']=150-this.data.Pokedex[i].baseStats['spe'];
        }
    }
};
