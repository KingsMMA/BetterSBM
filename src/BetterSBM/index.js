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
            if (window.bsbmCache === undefined) window.bsbmCache = {
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

            let fields = val.props.embed.fields;
            for (const field of fields) {
                if (field.rawName !== "Transcript:") continue;
                const transcript = field.rawValue.split("(")[1].split(")")[0];
                console.log(transcript);
            }
        }

    };

};