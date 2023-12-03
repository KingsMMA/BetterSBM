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
    const FloorIcons = [
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":bonzo:\" src=\"https://cdn.discordapp.com/emojis/785196577727709234.webp?size=44&amp;quality=lossless\" alt=\":bonzo:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196577727709234\"></span>",
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":scarf:\" src=\"https://cdn.discordapp.com/emojis/785196577467269193.webp?size=44&amp;quality=lossless\" alt=\":scarf:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196577467269193\"></span>",
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":theprofessor:\" src=\"https://cdn.discordapp.com/emojis/785196577559412737.webp?size=44&amp;quality=lossless\" alt=\":theprofessor:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196577559412737\"></span>",
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":thorn:\" src=\"https://cdn.discordapp.com/emojis/785196577777123384.webp?size=44&amp;quality=lossless\" alt=\":thorn:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196577777123384\"></span>",
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":livid:\" src=\"https://cdn.discordapp.com/emojis/785196578049753108.webp?size=44&amp;quality=lossless\" alt=\":livid:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196578049753108\"></span>",
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":sadan:\" src=\"https://cdn.discordapp.com/emojis/785196577886175242.webp?size=44&amp;quality=lossless\" alt=\":sadan:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196577886175242\"></span>",
        "<span class=\"emojiContainer__4a804 emojiContainerClickable__55a4f\" aria-expanded=\"false\" role=\"button\" tabindex=\"0\"><img aria-label=\":necron:\" src=\"https://cdn.discordapp.com/emojis/785196577802682388.webp?size=44&amp;quality=lossless\" alt=\":necron:\" draggable=\"false\" class=\"emoji\" data-type=\"emoji\" data-id=\"785196577802682388\"></span>"
    ];

    return class extends Plugin {

        onStart() {
            if (window.sbmCache === undefined) window.sbmCache = {
                tickets: {}
            }

            window.unpatchTicketViewer = Patcher.after(RenderFields, "renderFields", this.loadEmbed);

            Logger.info("Plugin enabled!");
        }

        onStop() {
            window.unpatchTicketViewer();

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

                    fetch(`https://kingrabbit.dev/sbm/api/v1/service?transcript=${transcript.split("/")[4]}&service=${service.toLowerCase()}`)
                        .then(response => response.json())
                        .then(data => {
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
                                    const floorData = floorStr in floors ? floors[floorStr] : {"comps": 0, "pb": -1, "pbS": -1, "pbSP": -1};
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