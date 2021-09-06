// If I want to make the minLuckyAmount work properly with buffs, here's how the game calculates buffed CPS:
//
// for (var i in Game.buffs)
// {
//     if (typeof Game.buffs[i].multCpS!=='undefined') mult*=Game.buffs[i].multCpS;
// }

myModObject = {
    resetMinLuckyAmount: function() {
        Game.minLuckyAmount = 0;
    },
    // These helper function will be added to the Golden Cookie definition, by this.init()
    // These injections aren't strictly necessary, because this original object can be referenced through Game.mods
    // But conceptually, I like that the Golden Cookie object having these methods
    fifteenMinOfProduction: function(cps) {
        return cps * 60 * 15;
    },
    calcLuckyAmount: function(cookies, cps) {
        // This is the original Lucky! formula
        // Provides 15% of cookies owned, or 15 minutes of cookie production - whichever is lowest, and then add 13 for good measure
        return 13 + Math.min(cookies * 0.15,
                             this.fifteenMinOfProduction(cps));
    },
    moddedLuckyAmount: function(goldenCookieMult) {
        var moniWithBuffs = goldenCookieMult * this.calcLuckyAmount(Game.cookies, Game.cookiesPs);

        // This will become the Lucky! floor, using unbuffedCps
        // Properly accounting for buffs would mean tracking the min amount for each unique buff combo
        // And I don't want to deal with that yet
        var moniWithoutBuffs = goldenCookieMult * this.calcLuckyAmount(Game.cookies, Game.unbuffedCps);

        // If bigger than existing Lucky! floor, overwrite with new value
        Game.minLuckyAmount = Math.max(Game.minLuckyAmount, moniWithoutBuffs);

        // Lastly, implement the Lucky! floor by returning that value if larger than the original formula
        return Math.max(moniWithBuffs, Game.minLuckyAmount);
    },
    // End of helper methods
    
    init: function() {
        if (typeof Game.minLuckyAmount === 'undefined') { Game.minLuckyAmount = 0; }
        Game.registerHook('reset', this.resetMinLuckyAmount);

        // Inject functions into the Golden Cookie object
        // Strictly speaking, only the popFunc inject is necessary, but I got tired of pulling helper functions from Game.mods
        Game.shimmerTypes['golden'].fifteenMinOfProduction = this.fifteenMinOfProduction;
        Game.shimmerTypes['golden'].calcLuckyAmount = this.calcLuckyAmount;
    },
    save: function() {
        return Game.minLuckyAmount.toString();
    },
    load: function(dataStr) {
        const parsed = parseInt(dataStr);
        if (!isNaN(parsed)) {
            Game.minLuckyAmount = parsed;
        }
    }
};

if (typeof Steam !== 'undefined') {
    // Need to add a delay for steam
    setTimeout(function() {
        Game.registerMod('persistent lucky bank', myModObject);
    }, 2000);
} else {
    Game.registerMod('persistent lucky bank', myModObject);
}
