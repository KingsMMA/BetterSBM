/**
 *
 * @param {import("zerespluginlibrary").Plugin} Plugin
 * @param {import("zerespluginlibrary").BoundAPI} Library
 * @returns
 */
module.exports = (Plugin, Library) => {

    const {Patcher, Logger} = Library;
    const RenderFields = BdApi.Webpack.getByPrototypeKeys("renderFields", "getMaxWidth").prototype;

    const Yes = "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\"✅\" src=\"https://discord.com/assets/e2902f38bd5c27bae536.svg\" alt=\"✅\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-name=\":white_check_mark:\"></span>";
    const No = "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\"❌\" src=\"https://discord.com/assets/d22e8c77c1aa9e5a69a2.svg\" alt=\"❌\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-name=\":x:\"></span>";

    const getIcon = (name, image) => {
        return `<span class="emojiContainer__4a804 emojiContainerClickable__55a4f" aria-expanded="false" role="button" tabindex="0"><img aria-label=":${name}:" src="${image}" alt="${name}" draggable="false" class="emoji" data-type="emoji"></span>`;
    }

    const FloorIcons = [
        getIcon("bonzo", "https://cdn.discordapp.com/emojis/785196577727709234.webp?size=44&amp;quality=lossless"),
        getIcon("scarf", "https://cdn.discordapp.com/emojis/785196577467269193.webp?size=44&amp;quality=lossless"),
        getIcon("theprofessor", "https://cdn.discordapp.com/emojis/785196577559412737.webp?size=44&amp;quality=lossless"),
        getIcon("thorn", "https://cdn.discordapp.com/emojis/785196577777123384.webp?size=44&amp;quality=lossless"),
        getIcon("livid", "https://cdn.discordapp.com/emojis/785196578049753108.webp?size=44&amp;quality=lossless"),
        getIcon("sadan", "https://cdn.discordapp.com/emojis/785196577886175242.webp?size=44&amp;quality=lossless"),
        getIcon("necron", "https://cdn.discordapp.com/emojis/785196577802682388.webp?size=44&amp;quality=lossless")
    ]

    const SlayerIcons = {
        rev: getIcon("rev", "https://wiki.hypixel.net/images/9/94/SkyBlock_sprite_npcs_revenant_horror.png"),
        eman: getIcon("eman", "https://wiki.hypixel.net/images/1/14/Minecraft_sprite_entity_enderman.png"),
        blaze: getIcon("blaze", "https://wiki.hypixel.net/images/2/2a/Minecraft_sprite_entity_blaze.png"),
    }

    const KuudraIcons = {
        basic: getIcon("basic", "https://wiki.hypixel.net/images/f/f0/SkyBlock_items_kuudra_tier_key.png"),
        hot: getIcon("hot", "https://wiki.hypixel.net/images/7/78/SkyBlock_items_kuudra_hot_tier_key.png"),
        burning: getIcon("burning", "https://wiki.hypixel.net/images/8/83/SkyBlock_items_kuudra_burning_tier_key.png"),
        fiery: getIcon("fiery", "https://wiki.hypixel.net/images/5/51/SkyBlock_items_kuudra_fiery_tier_key.png"),
        infernal: getIcon("infernal", "https://wiki.hypixel.net/images/3/3e/SkyBlock_items_kuudra_infernal_tier_key.png")
    };

    return class extends Plugin {

        onStart() {
            if (window.sbmCache === undefined) window.sbmCache = {
                tickets: {}
            }

            window.unpatchTicketViewer = Patcher.after(RenderFields, "renderFields", this.loadEmbed);

            const {Webpack: src_Webpack} = BdApi;
            const ConnectedReaction = src_Webpack.getModule(m => m?.type?.toString()?.includes('burstReactionsEnabled'), {searchExports: true});
            const unpatchConnectedReaction = Patcher.after(ConnectedReaction, 'type', (_, __, reaction) => {
                unpatchConnectedReaction();

                window.unpatchLogHider = Patcher.after(reaction.type.prototype, 'render', (thisObject, _, result) => {
                    const {message, emoji, count, type} = thisObject.props;
                    const renderTooltip = result.props.children[0].props.children;
                    if (message.embeds.length !== 1) return;
                    const embed = message.embeds[0];
                    const title = embed.rawTitle;
                    if (title === undefined) {
                        if (
                            (embed.footer === undefined || embed.footer.text !== "Skyblock Maniacs") ||
                            (embed.author === undefined) ||
                            (embed.fields.length !== 4 || embed.fields[0].rawName !== "Ticket Owner" || embed.fields[1].rawName !== "Ticket Name" ||
                                embed.fields[2].rawName !== "Panel Name" || embed.fields[3].rawName !== "Direct Transcript")
                        )
                            return;
                    } else {
                        const parts = title.split(" ");
                        if (parts.length !== 3 || parts[1] !== "Service" || parts[2] !== "Log") return;
                    }

                    console.log(message);
                    if (message.reactions !== undefined && message.reactions.length >= 1) {
                        const reaction = message.reactions[0];
                        if ((reaction.count === 1 && (reaction.emoji.name === "✅" || reaction.emoji.name === "❓")) || message.reactions.length === 2) {
                            message.blocked = true;
                        }
                    }
                });
            });

            Logger.info("Plugin enabled!");
        }

        onStop() {
            window.unpatchTicketViewer();
            window.unpatchLogHider();

            Logger.info("Plugin disabled!");
        }

        loadEmbed(val, args, ret) {
            if (val.props === null) return;
            if (val.props.embed === null) return;

            let customInfoDiv = null;
            let service = "";

            let fields = val.props.embed.fields;
            window.setTimeout(() => {
                for (const field of fields) {

                    if (field.rawName === "Service:") {
                        service = field.rawValue.toLowerCase();
                        continue;
                    }

                    if (field.rawName !== "Transcript:" && field.rawName !== "Direct Transcript") continue;
                    const transcript = field.rawValue.split("(")[1].split(")")[0];
                    if (!transcript.startsWith("https://sbm.gg/transcripts/")) continue;

                    customInfoDiv = document.createElement("div");
                    customInfoDiv.innerHTML = "";

                    let embed = document.getElementById("message-accessories-" + ret._owner.stateNode.props.messageId).children[0];
                    embed.appendChild(customInfoDiv);

                    if (transcript in window.sbmCache["tickets"]) {
                        customInfoDiv.innerHTML = window.sbmCache["tickets"][transcript];
                        break;
                    }

                    customInfoDiv.innerHTML = `<div><iframe src="${transcript}" title="Transcript" style="width: 95%; height: 500px; border-radius: 5px;"></iframe></div>`;

                    if (service === "" || service === "skill") continue;

                    fetch(`https://kingrabbit.dev/sbm/api/v1/service?transcript=${transcript.split("/")[4]}&service=${service.toLowerCase()}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data["success"] === false) {
                                customInfoDiv.innerHTML = customInfoDiv.innerHTML.substring(0, customInfoDiv.innerHTML.length - 43) + `<div style='padding: 15px'>An error occurred loading the data: ${data["error"]}</div>`;
                                return;
                            }

                            let isDungeons = service === "dungeon";
                            if (isDungeons || service === "master_mode") {
                                const floors = data["floors"];

                                const convertTime = timeInMs => {
                                    const minutes = Math.floor(timeInMs / 60000);
                                    const seconds = ((timeInMs % 60000) / 1000).toFixed(0);
                                    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
                                }

                                const getDivForSect = (floor) => {
                                    const floorStr = "" + floor;
                                    const floorData = floorStr in floors ? floors[floorStr] : {
                                        "comps": 0,
                                        "pb": -1,
                                        "pbS": -1,
                                        "pbSP": -1
                                    };
                                    return `<div style="width: ${isDungeons ? 50 : 33}%; float: left;">${floor <= 3 || (floor <= 5 && isDungeons) ? "" : "<br>"}${FloorIcons[floor - 1]} <b>${isDungeons ? "Floor" : "Master"} ${floor}:</b><br><b>` +
                                        `    Collection: </b>${floorData["comps"]}<br>` +
                                        `    ${floorData["pb"] === -1 ? No : Yes} Comp${floorData["pb"] === -1 ? "" : ` <em>(${convertTime(floorData["pb"])})</em>`}<br>` +
                                        `    ${floorData["pbS"] === -1 ? No : Yes} S${floorData["pbS"] === -1 ? "" : ` <em>(${convertTime(floorData["pbS"])})</em>`}<br>` +
                                        `    ${floorData["pbSP"] === -1 ? No : Yes} S+${floorData["pbSP"] === -1 ? "" : ` <em>(${convertTime(floorData["pbSP"])})</em>`}<br></div>`;
                                };

                                let newSrc = customInfoDiv.innerHTML.substring(0, customInfoDiv.innerHTML.length - 43) + "<div class='embedFields__51397' style='display: inline-block; width: 100%; padding: 8px 15px 15px 15px; -webkit-box-sizing: border-box;'>";
                                for (let i = isDungeons ? 4 : 1; i <= 7; i++) {
                                    newSrc += getDivForSect(i);
                                    if (isDungeons && (i === 5)) newSrc += "<br>";
                                    else if (!isDungeons && (i === 3 || i === 6)) newSrc += "<br>";
                                }

                                customInfoDiv.innerHTML = newSrc + "</div>";
                            } else if (service === "slayer") {
                                let newSrc = customInfoDiv.innerHTML.substring(0, customInfoDiv.innerHTML.length - 43) + "<div class='embedFields__51397' style='display: inline-block; width: 100%; padding: 0px 15px 15px 15px; -webkit-box-sizing: border-box;'>";
                                const slayerData = data["bosses"];
                                const temp = "<div style='width: 33%; float: left;'>";
                                newSrc += `${temp}<br>${SlayerIcons["blaze"]} <b>Blaze:</b><br><b>Tier 2:</b> ${slayerData["b2"]}<br><b>Tier 3:</b> ${slayerData["b3"]}<br><b>Tier 4:</b> ${slayerData["b4"]}</div>`;
                                newSrc += `${temp}<br>${SlayerIcons["eman"]} <b>Enderman:</b><br><b>Tier 3:</b> ${slayerData["e3"]}<br><b>Tier 4:</b> ${slayerData["e4"]}</div>`;
                                newSrc += `${temp}<br>${SlayerIcons["rev"]} <b>Revenant:</b><br><b>Tier 5:</b> ${slayerData["r5"]}</div>`;
                                customInfoDiv.innerHTML = newSrc + "</div>";
                            } else if (service === "kuudra") {
                                const kuudraData = data["tiers"];
                                let newSrc = customInfoDiv.innerHTML.substring(0, customInfoDiv.innerHTML.length - 43) + "<div class='embedFields__51397' style='display: inline-block; width: 100%; padding: 0px 15px 15px 15px; -webkit-box-sizing: border-box;'>";
                                for (const tier of ["Basic", "Hot", "Burning", "Fiery", "Infernal"]) {
                                    let _tier = tier.toLowerCase();
                                    newSrc += `<br>${KuudraIcons[_tier]} <b>${tier}:</b> ${kuudraData[_tier]}`;
                                }
                                customInfoDiv.innerHTML = newSrc + "</div>";
                            }
                        })
                        .catch(error => {
                            Logger.error(error);
                            customInfoDiv.innerHTML = customInfoDiv.innerHTML.substring(0, customInfoDiv.innerHTML.length - 43) + "<div style='padding: 15px'>An error occurred loading the data.  This is most likely due to the API server being down.<br>If this error persists or is inconsistent, please contact 'kingsdev' on discord.</div>";
                        });
                }

                if (["dungeon", "master_mode", "kuudra", "slayer"].includes(service)) {
                    if (customInfoDiv === undefined || customInfoDiv === null) return;  // The error is caused by logs that didn't close the ticket (there isn't a transcript attached)
                    else if (customInfoDiv.innerHTML === undefined || customInfoDiv.innerHTML === null || customInfoDiv.innerHTML === "") customInfoDiv.innerHTML = "<div style='padding: 15px'>Loading...</div>";
                    else customInfoDiv.innerHTML += "<div style='padding: 15px'>Loading...</div>";
                }

            }, 100);
        }

    };

};