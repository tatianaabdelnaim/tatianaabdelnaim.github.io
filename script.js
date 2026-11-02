function getKeyValue(line){
    const separator = line.indexOf("=");

    if (separator === -1) {
        return null;
    }

    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    return {key, value};
}

$(document).ready(function(){
    const headerImage = document.getElementById("header-image");
    const talksContainer = document.getElementById("talks");
    const talksList = document.getElementById("talks-list");
    const template = document.getElementById("talk-template");

    let talks = [];
    let currentTalk = null;
    let showTalks = false;

    $.ajax({
        url: "talks.txt",
        type: "GET",
        cache: false,
        success: function(text) {
            // Parse text file
            const lines = text.split(/\r?\n/);

            const line1 = getKeyValue(lines[0].trim());

            if(line1["key"] !== "show_talks"){
                return;
            }

            showTalks = ["true", "yes", "1"].includes(line1["value"].toLowerCase());

            if(showTalks){
                headerImage.hidden = true;
                talksContainer.hidden = false;
        
                for (const line of lines.slice(1)) {
                    const trimmedLine = line.trim();
        
                    if (!trimmedLine) {
                        continue;
                    }
        
                    // Detect section
                    if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
                        section = trimmedLine.slice(1, -1);
        
                        if (section === "talk") {
                            currentTalk = {};
                            talks.push(currentTalk);
                        }
        
                        continue;
                    }
        
                    const talkLine = getKeyValue(trimmedLine);
                    const talkKey = talkLine["key"];
                    const talkValue = talkLine["value"];
        
                    if (section === "talk" && currentTalk !== null) {
                        currentTalk[talkKey] = talkValue;
                    }
                }
        
                // Generate HTML
                const fragment = document.createDocumentFragment();
        
                for (const talk of talks) {
                    const clone = template.content.cloneNode(true);
        
                    clone.querySelector(".talk__date").textContent = talk.date || "";
                    clone.querySelector(".talk__title").textContent = talk.title || "";
                    clone.querySelector(".talk__university").textContent = talk.university || "";
        
                    fragment.appendChild(clone);
                }
        
                talksList.replaceChildren(fragment);
            }
            else {
                talksList.replaceChildren();
                talksContainer.hidden = true;
            }
        },
        complete: function() {
            AOS.init({
                once: true,
                offset: 20
            });
        }
    });
});
