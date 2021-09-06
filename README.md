# Persistent Lucky Bank mod for Cookie Clicker
Cookie Clicker's Golden Cookie mechanics reward saving a "bank" of cookies, because [the reward for the Lucky! effect is based on your current cookie amount](https://cookieclicker.fandom.com/wiki/Golden_Cookie#Outcomes). Conversely, this means you're punished for spending all of the cookies you've earned. Usually people will use a mod like [Cookie Monster](https://github.com/CookieMonsterTeam/CookieMonster/), which provides a warning that buying something would take you below the optimal amount.

But even with a mod, it's still tedious and not fun to see that something is buyable, but wait a long time to actually buy it in order to maintain optimal profits. Especially with buff combos that effectively increase the cap for Lucky!, you need to keep hours worth of profits "banked". And if you do spend below the cap, it will take longer to get back to where you were.

This mod changes the formula for Lucky! cookies, by saving the max amount earned from a Lucky! cookie and making that the minimum for all future Lucky! calculations. This keeps the mechanic of rewarding you for saving up a large bank, without the punishment for spending what you've earned.

I think this is an interesting alternative design that improves the pace of the game before offline profits have been unlocked. The game just feels like a chore when all you can do is hunt Golden Cookies for hours. With a "persistent bank," you can actually spend what you're earning instead of hoarding it forever.

## Limitations

The mod currently doesn't support buffs. Naively using the post-buff Cookies Per Second value would mean a first Frenzy'd Lucky! would provide a massive minimum amount, even when Frenzy isn't active. I definitely want to support buffs, just need to think of a smooth way to track multiple values for different buff combinations.
