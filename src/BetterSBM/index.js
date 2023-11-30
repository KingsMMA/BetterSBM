/**
 * 
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Library 
 * @returns 
 */
module.exports = (Plugin, Library) => {

    const {Patcher, Logger} = Library;
    const RenderFields = BdApi.Webpack.getByPrototypeKeys("renderFields", "getMaxWidth").prototype;

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

            let fields = val.props.embed.fields;
            for (const field of fields) {
                if (field.rawName !== "Transcript:") continue;
                const transcript = field.rawValue.split("(")[1].split(")")[0];
                if (!transcript.startsWith("https://sbm.gg/transcripts/")) continue;

                customInfoDiv = document.createElement("div");

                if (transcript in window.sbmCache["tickets"]) {
                    customInfoDiv.innerHTML = window.sbmCache["tickets"][transcript];
                    ret.props.children.push(BdApi.React.createElement(BdApi.ReactUtils.wrapElement(customInfoDiv)));
                    break;
                }

                customInfoDiv.innerHTML = `<div><iframe src="${transcript}" title="Transcript" style="width: 355%; height: 500px; border-radius: 5px;"></iframe></div>`;
                ret.props.children.push(BdApi.React.createElement(BdApi.ReactUtils.wrapElement(customInfoDiv)));

                window.sbmCache["tickets"][transcript] = customInfoDiv.innerHTML;
            }
        }

    };

};