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

            BdApi.DOM.addStyle("BetterSBM", `.content__764ce.content__96073.thin_b1c063.scrollerBase_dc3aa9 {
                color: white;
            }
            
            .chatContent__5dca8:has(.messageListItem__6a4fb[id*="875229228625428530"]) .messageListItem__6a4fb:has(.reactions_b8dc93 img[data-name="👍"]),
            .chatContent__5dca8:has(.messageListItem__6a4fb[id*="1117587573653647390"]) .messageListItem__6a4fb:has(.reactions_b8dc93 img[data-name="👍"]),
            .chatContent__5dca8:has(.messageListItem__6a4fb[id*="1117587647859265597"]) .messageListItem__6a4fb:has(.reactions_b8dc93 img[data-name="👍"]),
            .chatContent__5dca8:has(.messageListItem__6a4fb[id*="950669851855302696"]) .messageListItem__6a4fb:has(.reactions_b8dc93 img[data-name="👍"]),
            .chatContent__5dca8:has(.messageListItem__6a4fb[id*="1117587509493379203"]) .messageListItem__6a4fb:has(.reactions_b8dc93 img[data-name="👍"]) {
                display:none;
            }`);

            window.unpatchTicketViewer = Patcher.after(RenderFields, "renderFields", this.loadEmbed);

            const {Webpack: src_Webpack} = BdApi;
            const ConnectedReaction = src_Webpack.getModule(m => m?.type?.toString()?.includes('burstReactionsEnabled'), {searchExports: true});

            Logger.info("Plugin enabled!");
        }

        onStop() {
            BdApi.DOM.removeStyle("BetterSBM");
            window.unpatchTicketViewer();
            Logger.info("Plugin disabled!");
        }

        getSettingsPanel() {
            return "<div class=\"content__764ce  content__96073 thin_b1c063 scrollerBase_dc3aa9\"><h1 class=\" \">Reviewing Logs</h1><ul><li><span>First</span><span>, check that the player has all the logged carries on their account</span><span>.<br>" +
                "    </span><span>- If they do</span><span>, react with the </span><span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":white_check_mark:\" src=\"/assets/e2902f38bd5c27bae536.svg\" alt=\":white_check_mark:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-name=\":white_check_mark:\"></span><span> emoji</span><span>.<br>" +
                "    </span><span>- If they don</span><span>'t</span><span>, </span><strong><span>manually verify this</span></strong><span>, then react with the </span><span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":x:\" src=\"/assets/d22e8c77c1aa9e5a69a2.svg\" alt=\":x:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-name=\":x:\"></span><span> emoji</span><span>.  Make sure to contact the client and carrier to see what happened</span><span>.</span></li><li><span>Next</span><span>, skim the ticket to </span><strong><span>check for any strikable offences</span></strong><span>.<br>" +
                "    </span><span>- If there were any strikable offences </span><span>(including false logging</span><span>)</span><span>, react with the </span><span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":bowling:\" src=\"/assets/2476d08f3cdc3483439a.svg\" alt=\":bowling:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-name=\":bowling:\"></span><span> emoji</span><span>.  If they weren</span><span>'t already striked for it</span><span>, do so</span><span>.</span></li><li><span>If relevant</span><span>, </span><strong><span>check the times</span></strong><span> of the logged services to see if they were done in a reasonable amount of time given the floor</span><span>, score</span><span>, and any relevant mayors</span><span>.<br>" +
                "    </span><span>- If they weren</span><span>'t</span><span>, skill check the carrier</span><span>.</span></li><li><span>Once you</span><span>'ve done all of this</span><span>, react with the </span><span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":thumbsup:\" src=\"/assets/7a934d8b65db3219592b.svg\" alt=\":thumbsup:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-name=\":thumbsup:\"></span><span> emoji to </span><strong><span>mark the ticket as reviewed</span></strong><span>.  Make sure all action has been taken first</span><span>, including the verification of carries completed</span><span>.  That is</span><span>, don</span><span>'t mark a log as reviewed if the client and carrier still need to be contacted or if you are still determining if a strike should be given</span><span>.</span></li><li><span>If another user has already reacted to a message</span><span>, please leave it for them to finish</span><span>.  If they seem to have forgotten</span><span>, feel free to remind them with a friendly ping in </span><span class=\"channelMention wrapper_f46140 interactive\" role=\"link\" tabindex=\"0\"><span><span class=\"nowrap__8fddb\"><div class=\"icon_c48348 icon_f8ef92 iconSizeMedium_c7d5f7 iconActiveMedium_d5475f\" style=\"background-image: url(&quot;https://cdn.discordapp.com/icons/753255055024586934/a_462ee65c847b1ae68993d9754c35909d.webp?size=40&quot;);\"></div>⁠</span><span class=\"name_cbb123\">Skyblock Maniacs</span></span><svg class=\"icon_dd1609\" aria-hidden=\"true\" role=\"img\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><g fill=\"none\" fill-rule=\"evenodd\"><polygon fill=\"currentColor\" fill-rule=\"nonzero\" points=\"8.47 2 6.12 4.35 13.753 12 6.12 19.65 8.47 22 18.47 12\"></polygon><polygon points=\"0 0 24 0 24 24 0 24\"></polygon></g></svg><span class=\"channelWithIcon iconMentionText__3b666\"><span class=\"nowrap__8fddb\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"icon_ecf39b\" aria-label=\"Channel\" aria-hidden=\"false\" role=\"img\"><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z\"></path></svg>⁠</span><span class=\"name__48cc7\"><span>💬｜staff-chat</span></span></span></span><span>.</span></li><li><span>If you have any questions</span><span>, feel free to DM </span><span class=\"mention wrapper_f46140 interactive\" aria-expanded=\"false\" tabindex=\"0\" role=\"button\">@KingRabbit</span><span> </span><span>(kingsdev</span><span>) on discord or ask in </span><span class=\"channelMention wrapper_f46140 interactive\" role=\"link\" tabindex=\"0\"><span><span class=\"nowrap__8fddb\"><div class=\"icon_c48348 icon_f8ef92 iconSizeMedium_c7d5f7 iconActiveMedium_d5475f\" style=\"background-image: url(&quot;https://cdn.discordapp.com/icons/753255055024586934/a_462ee65c847b1ae68993d9754c35909d.webp?size=40&quot;);\"></div>⁠</span><span class=\"name_cbb123\">Skyblock Maniacs</span></span><svg class=\"icon_dd1609\" aria-hidden=\"true\" role=\"img\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><g fill=\"none\" fill-rule=\"evenodd\"><polygon fill=\"currentColor\" fill-rule=\"nonzero\" points=\"8.47 2 6.12 4.35 13.753 12 6.12 19.65 8.47 22 18.47 12\"></polygon><polygon points=\"0 0 24 0 24 24 0 24\"></polygon></g></svg><span class=\"channelWithIcon iconMentionText__3b666\"><span class=\"nowrap__8fddb\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" class=\"icon_ecf39b\" aria-label=\"Channel\" aria-hidden=\"false\" role=\"img\"><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z\"></path></svg>⁠</span><span class=\"name__48cc7\"><span>💬｜staff-chat</span></span></span></span><span>.</span></li></ul></div>"
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