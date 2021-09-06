# Persistent Lucky Bank mod for Cookie Clicker
Cookie Clicker's Golden Cookie mechanics reward saving a "bank" of cookies, because [the reward for the Lucky! effect is based on your current cookie amount](https://cookieclicker.fandom.com/wiki/Golden_Cookie#Outcomes). Conversely, this means you're punished for spending all of the cookies you've earned. Usually people will use a mod like [Cookie Monster](https://github.com/CookieMonsterTeam/CookieMonster/), which provides a warning that buying something would take you below the optimal amount.

But even with a mod, it's still tedious and not fun to see that something is buyable, but wait a long time to actually buy it in order to maintain optimal profits. Especially with buff combos that effectively increase the cap for Lucky!, you need to keep hours worth of profits "banked". And if you do spend below the cap, it will take longer to get back to where you were.

This mod changes the behaviour of Lucky! cookies, by saving the amount of cookies you have at the time you clicked it. I don't know of an ingame variable tracking "maximum cookies held", only earned, so the mod adds its own. Then this max cookies held value is used for computing the Lucky! value, instead of your current cookies banked.

I think this is an interesting alternative design that improves the pace of the game before offline profits have been unlocked. The game just feels like a chore when all you can do is hunt Golden Cookies for hours. With a "persistent bank," you can actually spend what you're earning instead of hoarding it forever.

## Limitations

The mod currently doesn't support Conjure Baked Goods.
