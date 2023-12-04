# Better SBM
BetterDiscord plugin to help Skyblock Maniacs staff members

## Reviewing logs
The following is a tutorial on how to review logs.  It can be accessed in-app by opening BetterSBM's plugin settings in **`Settings > BetterDiscord > Plugins`**.

- First, check that the player has all the logged carries on their account.
    - If they do, react with the `:white_check_mark:` emoji.
    - If they don't, **manually verify this**, then react with the `:x:` emoji.  Make sure to contact the client and carrier to see what happened.
- Next, skim the ticket to **check for any strikable offences**.
    - If there were any strikable offences (including false logging), react with the `:bowling:` emoji.  If they weren't already striked for it, do so.
- If relevant, **check the times** of the logged services to see if they were done in a reasonable amount of time given the floor, score, and any relevant mayors.
    - If they weren't, skill check the carrier.
- Once you've done all of this, react with the `:thumbsup:` emoji to **mark the ticket as reviewed**.  Make sure all action has been taken first, including the verification of carries completed.  That is, don't mark a log as reviewed if the client and carrier still need to be contacted or if you are still determining if a strike should be given.
- If another user has already reacted to a message, please leave it for them to finish.  If they seem to have forgotten, feel free to remind them with a friendly ping in ⁠`💬｜staff-chat`.
- If you have any questions, feel free to DM `kingsdev` on discord, ask in `⁠💬｜staff-chat`, or create an issue on the repo.

## Run Configurations
A run configuration can be used to automatically build the plugin and load it in BetterDiscord.

### IntelliJ
1. Create a new `npm` run configuration
2. Set the command to `run`
3. Set the scripts to `build`
4. Set the arguments to `BetterSBM`

### Command Line
1. Run `npm run build BetterSBM`
