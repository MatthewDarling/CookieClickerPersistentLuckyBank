// Eventually, should also support Conjure Baked Goods from the Wizard Tower Grimoire
var modName = 'persistent lucky bank';

myModObject = {
    resetMinCookieBank: function() {
        Game.minCookieBank = 0;
    },
    // These helper function will be added to the Golden Cookie definition, by this.init()
    // These injections aren't strictly necessary, because this original object can be referenced through Game.mods
    // But conceptually, I like that the Golden Cookie object having these methods
    writeMinCookieBank: function() {
        // If the current cookie total is higher than the "cookie bank", save as the new cookie bank
        Game.minCookieBank = Math.max(Game.minCookieBank, Game.cookies)
    },
    minutesOfProduction: function(cps, minutes) {
        return cps * 60 * minutes;
    },
    calcLuckyAmount: function(cookies, cps) {
        // This is the original Lucky! formula
        // Provides 15% of cookies owned, or 15 minutes of cookie production - whichever is lowest, and then add 13 for good measure
        return 13 + Math.min(cookies * 0.15,
                             this.minutesOfProduction(cps, 15));
    },
    moddedLuckyAmount: function(goldenCookieMult) {
        this.writeMinCookieBank();

        // Run the original Lucky! formula, changing just the cookie input value
        // This accounts properly for all the many ways cookies-per-second can be modified
        return goldenCookieMult * this.calcLuckyAmount(Game.minCookieBank, Game.cookiesPs);
    },
    // End of helper methods
    
    // This function will be injected into the Golden Cookie definition by this.init(), overwriting the original
    newGoldenCookiePop: function(me) {
        //get achievs and stats
        if (me.spawnLead)
        {
            Game.goldenClicks++;
            Game.goldenClicksLocal++;
            
            if (Game.goldenClicks>=1) Game.Win('Golden cookie');
            if (Game.goldenClicks>=7) Game.Win('Lucky cookie');
            if (Game.goldenClicks>=27) Game.Win('A stroke of luck');
            if (Game.goldenClicks>=77) Game.Win('Fortune');
            if (Game.goldenClicks>=777) Game.Win('Leprechaun');
            if (Game.goldenClicks>=7777) Game.Win('Black cat\'s paw');
            if (Game.goldenClicks>=27777) Game.Win('Seven horseshoes');
            
            if (Game.goldenClicks>=7) Game.Unlock('Lucky day');
            if (Game.goldenClicks>=27) Game.Unlock('Serendipity');
            if (Game.goldenClicks>=77) Game.Unlock('Get lucky');
            
            if ((me.life/Game.fps)>(me.dur-1)) Game.Win('Early bird');
            if (me.life<Game.fps) Game.Win('Fading luck');
        }
        
        if (Game.forceUnslotGod)
        {
            if (Game.forceUnslotGod('asceticism')) Game.useSwap(1000000);
        }
        
        //select an effect
        var list=[];
        if (me.wrath>0) list.push('clot','multiply cookies','ruin cookies');
        else list.push('frenzy','multiply cookies');
        if (me.wrath>0 && Game.hasGod && Game.hasGod('scorn')) list.push('clot','ruin cookies','clot','ruin cookies');
        if (me.wrath>0 && Math.random()<0.3) list.push('blood frenzy','chain cookie','cookie storm');
        else if (Math.random()<0.03 && Game.cookiesEarned>=100000) list.push('chain cookie','cookie storm');
        if (Math.random()<0.05 && Game.season=='fools') list.push('everything must go');
        if (Math.random()<0.1 && (Math.random()<0.05 || !Game.hasBuff('Dragonflight'))) list.push('click frenzy');
        if (me.wrath && Math.random()<0.1) list.push('cursed finger');
        
        if (Game.BuildingsOwned>=10 && Math.random()<0.25) list.push('building special');
        
        if (Game.canLumps() && Math.random()<0.0005) list.push('free sugar lump');
        
        if ((me.wrath==0 && Math.random()<0.15) || Math.random()<0.05)
        {
            //if (Game.hasAura('Reaper of Fields')) list.push('dragon harvest');
            if (Math.random()<Game.auraMult('Reaper of Fields')) list.push('dragon harvest');
            //if (Game.hasAura('Dragonflight')) list.push('dragonflight');
            if (Math.random()<Game.auraMult('Dragonflight')) list.push('dragonflight');
        }
        
        if (this.last!='' && Math.random()<0.8 && list.indexOf(this.last)!=-1) list.splice(list.indexOf(this.last),1);//80% chance to force a different one
        if (Math.random()<0.0001) list.push('blab');
        var choice=choose(list);
        
        if (this.chain>0) choice='chain cookie';
        if (me.force!='') {this.chain=0;choice=me.force;me.force='';}
        if (choice!='chain cookie') this.chain=0;
        
        this.last=choice;
        
        //create buff for effect
        //buff duration multiplier
        var effectDurMod=1;
        if (Game.Has('Get lucky')) effectDurMod*=2;
        if (Game.Has('Lasting fortune')) effectDurMod*=1.1;
        if (Game.Has('Lucky digit')) effectDurMod*=1.01;
        if (Game.Has('Lucky number')) effectDurMod*=1.01;
        if (Game.Has('Green yeast digestives')) effectDurMod*=1.01;
        if (Game.Has('Lucky payout')) effectDurMod*=1.01;
        //if (Game.hasAura('Epoch Manipulator')) effectDurMod*=1.05;
        effectDurMod*=1+Game.auraMult('Epoch Manipulator')*0.05;
        if (!me.wrath) effectDurMod*=Game.eff('goldenCookieEffDur');
        else effectDurMod*=Game.eff('wrathCookieEffDur');
        
        if (Game.hasGod)
        {
            var godLvl=Game.hasGod('decadence');
            if (godLvl==1) effectDurMod*=1.07;
            else if (godLvl==2) effectDurMod*=1.05;
            else if (godLvl==3) effectDurMod*=1.02;
        }
        
        //effect multiplier (from lucky etc)
        var mult=1;
        //if (me.wrath>0 && Game.hasAura('Unholy Dominion')) mult*=1.1;
        //else if (me.wrath==0 && Game.hasAura('Ancestral Metamorphosis')) mult*=1.1;
        if (me.wrath>0) mult*=1+Game.auraMult('Unholy Dominion')*0.1;
        else if (me.wrath==0) mult*=1+Game.auraMult('Ancestral Metamorphosis')*0.1;
        if (Game.Has('Green yeast digestives')) mult*=1.01;
        if (Game.Has('Dragon fang')) mult*=1.03;
        if (!me.wrath) mult*=Game.eff('goldenCookieGain');
        else mult*=Game.eff('wrathCookieGain');
        
        var popup='';
        var buff=0;
        
        if (choice=='building special')
        {
            var time=Math.ceil(30*effectDurMod);
            var list=[];
            for (var i in Game.Objects)
            {
                if (Game.Objects[i].amount>=10) list.push(Game.Objects[i].id);
            }
            if (list.length==0) {choice='frenzy';}//default to frenzy if no proper building
            else
            {
                var obj=choose(list);
                var pow=Game.ObjectsById[obj].amount/10+1;
                if (me.wrath && Math.random()<0.3)
                {
                    buff=Game.gainBuff('building debuff',time,pow,obj);
                }
                else
                {
                    buff=Game.gainBuff('building buff',time,pow,obj);
                }
            }
        }
        
        if (choice=='free sugar lump')
        {
            Game.gainLumps(1);
            popup='Sweet!<div style="font-size:65%;">Found 1 sugar lump!</div>';
        }
        else if (choice=='frenzy')
        {
            buff=Game.gainBuff('frenzy',Math.ceil(77*effectDurMod),7);
        }
        else if (choice=='dragon harvest')
        {
            buff=Game.gainBuff('dragon harvest',Math.ceil(60*effectDurMod),15);
        }
        else if (choice=='everything must go')
        {
            buff=Game.gainBuff('everything must go',Math.ceil(8*effectDurMod),5);
        }
        else if (choice == 'multiply cookies') {
            // Only novel part compared to original popFunc
            var moni = this.moddedLuckyAmount(mult);
            Game.Earn(moni);
            popup = 'Lucky!<div style="font-size:65%;">+' + Beautify(moni) + ' cookies!</div>';
        }
        else if (choice=='ruin cookies')
        {
            var moni=Math.min(Game.cookies*0.05,Game.cookiesPs*60*10)+13;//lose 5% of cookies owned (-13), or 10 minutes of cookie production - whichever is lowest
            moni=Math.min(Game.cookies,moni);
            Game.Spend(moni);
            popup='Ruin!<div style="font-size:65%;">Lost '+Beautify(moni)+' cookies!</div>';
        }
        else if (choice=='blood frenzy')
        {
            buff=Game.gainBuff('blood frenzy',Math.ceil(6*effectDurMod),666);
        }
        else if (choice=='clot')
        {
            buff=Game.gainBuff('clot',Math.ceil(66*effectDurMod),0.5);
        }
        else if (choice=='cursed finger')
        {
            buff=Game.gainBuff('cursed finger',Math.ceil(10*effectDurMod),Game.cookiesPs*Math.ceil(10*effectDurMod));
        }
        else if (choice=='click frenzy')
        {
            buff=Game.gainBuff('click frenzy',Math.ceil(13*effectDurMod),777);
        }
        else if (choice=='dragonflight')
        {
            buff=Game.gainBuff('dragonflight',Math.ceil(10*effectDurMod),1111);
            if (Math.random()<0.8) Game.killBuff('Click frenzy');
        }
        else if (choice=='chain cookie')
        {
            //fix by Icehawk78
            if (this.chain==0) this.totalFromChain=0;
            this.chain++;
            var digit=me.wrath?6:7;
            if (this.chain==1) this.chain+=Math.max(0,Math.ceil(Math.log(Game.cookies)/Math.LN10)-10);
            
            var maxPayout=Math.min(Game.cookiesPs*60*60*6,Game.cookies*0.5)*mult;
            var moni=Math.max(digit,Math.min(Math.floor(1/9*Math.pow(10,this.chain)*digit*mult),maxPayout));
            var nextMoni=Math.max(digit,Math.min(Math.floor(1/9*Math.pow(10,this.chain+1)*digit*mult),maxPayout));
            this.totalFromChain+=moni;
            var moniStr=Beautify(moni);

            //break the chain if we're above 5 digits AND it's more than 50% of our bank, it grants more than 6 hours of our CpS, or just a 1% chance each digit (update : removed digit limit)
            if (Math.random()<0.01 || nextMoni>=maxPayout)
            {
                this.chain=0;
                popup='Cookie chain<div style="font-size:65%;">+'+moniStr+' cookies!<br>Cookie chain over. You made '+Beautify(this.totalFromChain)+' cookies.</div>';
            }
            else
            {
                popup='Cookie chain<div style="font-size:65%;">+'+moniStr+' cookies!</div>';//
            }
            Game.Earn(moni);
        }
        else if (choice=='cookie storm')
        {
            buff=Game.gainBuff('cookie storm',Math.ceil(7*effectDurMod),7);
        }
        else if (choice=='cookie storm drop')
        {
            var moni=Math.max(mult*(Game.cookiesPs*60*Math.floor(Math.random()*7+1)),Math.floor(Math.random()*7+1));//either 1-7 cookies or 1-7 minutes of cookie production, whichever is highest
            Game.Earn(moni);
            popup='<div style="font-size:75%;">+'+Beautify(moni)+' cookies!</div>';
        }
        else if (choice=='blab')//sorry (it's really rare)
        {
            var str=choose([
                'Cookie crumbliness x3 for 60 seconds!',
                'Chocolatiness x7 for 77 seconds!',
                'Dough elasticity halved for 66 seconds!',
                'Golden cookie shininess doubled for 3 seconds!',
                'World economy halved for 30 seconds!',
                'Grandma kisses 23% stingier for 45 seconds!',
                'Thanks for clicking!',
                'Fooled you! This one was just a test.',
                'Golden cookies clicked +1!',
                'Your click has been registered. Thank you for your cooperation.',
                'Thanks! That hit the spot!',
                'Thank you. A team has been dispatched.',
                'They know.',
                'Oops. This was just a chocolate cookie with shiny aluminium foil.'
            ]);
            popup=str;
        }
        
        if (popup=='' && buff && buff.name && buff.desc) popup=buff.name+'<div style="font-size:65%;">'+buff.desc+'</div>';
        if (popup!='') Game.Popup(popup,me.x+me.l.offsetWidth/2,me.y);
        
        Game.DropEgg(0.9);
        
        //sparkle and kill the shimmer
        Game.SparkleAt(me.x+48,me.y+48);
        if (choice=='cookie storm drop')
        {
            if (Game.prefs.cookiesound) PlaySound('snd/clickb'+Math.floor(Math.random()*7+1)+'.mp3',0.75);
            else PlaySound('snd/click'+Math.floor(Math.random()*7+1)+'.mp3',0.75);
        }
        else PlaySound('snd/shimmerClick.mp3');
        me.die();
    },
    init: function() {
        if (typeof Game.minCookieBank === 'undefined') { Game.minCookieBank = 0; }
        Game.registerHook('reset', this.resetMinCookieBank);

        // Inject functions into the Golden Cookie object
        // Strictly speaking, only the popFunc inject is necessary, but I got tired of pulling helper functions from Game.mods
        Game.shimmerTypes['golden'].writeMinCookieBank = this.writeMinCookieBank;
        Game.shimmerTypes['golden'].minutesOfProduction = this.minutesOfProduction;
        Game.shimmerTypes['golden'].calcLuckyAmount = this.calcLuckyAmount;
        Game.shimmerTypes['golden'].moddedLuckyAmount = this.moddedLuckyAmount;

        originalGoldenCookiePop = Game.shimmerTypes['golden'].popFunc;
        Game.shimmerTypes['golden'].popFunc = this.newGoldenCookiePop;
    },
    save: function() {
        return Game.minCookieBank.toString();
    },
    load: function(dataStr) {
        const parsed = parseInt(dataStr);
        if (!isNaN(parsed)) {
            Game.minCookieBank = parsed;
        }
    }
};

if (typeof Steam !== 'undefined') {
    // Need to add a delay for steam
    setTimeout(function() {
        Game.registerMod(modName, myModObject);
    }, 2000);
} else {
    Game.registerMod(modName, myModObject);
}
