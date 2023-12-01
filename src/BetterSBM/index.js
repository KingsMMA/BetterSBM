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
            for (const field of fields) {

                if (field.rawName === "Service:") {
                    service = field.rawValue;
                    continue;
                }

                if (field.rawName !== "Transcript:") continue;
                const transcript = field.rawValue.split("(")[1].split(")")[0];
                if (!transcript.startsWith("https://sbm.gg/transcripts/")) continue;

                customInfoDiv = document.createElement("div");
                customInfoDiv.innerHTML = "";

                if (transcript in window.sbmCache["tickets"]) {
                    customInfoDiv.innerHTML = window.sbmCache["tickets"][transcript];
                    ret.props.children.push(BdApi.React.createElement(BdApi.ReactUtils.wrapElement(customInfoDiv)));
                    break;
                }

                customInfoDiv.innerHTML = `<div><iframe src="${transcript}" title="Transcript" style="width: 355%; height: 500px; border-radius: 5px;"></iframe></div>`;
                ret.props.children.push(BdApi.React.createElement(BdApi.ReactUtils.wrapElement(customInfoDiv)));

                fetch(`https://kingrabbit.dev/sbm/api/v1/service?transcript=${transcript.split("/")[4]}&service=${service.toLowerCase()}`)
                    .then(response => response.json())
                    .then(data => {
                        if (service === "dungeon" || service === "master_mode") {

                        }
                    })
                    .catch(error => {
                        Logger.error(error);
                        customInfoDiv.innerHTML = customInfoDiv.innerHTML.substring(0, customInfoDiv.innerHTML.length - 10) + "<div style=\"width: 355%\">An error occurred loading the data.  This is most likely due to the API server being down.</div>";
                    });
            }

            if (["Dungeon", "Master_mode", "Kuudra", "Slayer"].includes(service)) {
                if (customInfoDiv.innerHTML === null || customInfoDiv.innerHTML === undefined || customInfoDiv.innerHTML === "") customInfoDiv.innerHTML = "Loading...";
                else customInfoDiv.innerHTML += "Loading...";
            }
        }

    };

};