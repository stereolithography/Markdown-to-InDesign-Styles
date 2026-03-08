// InDesign .jsx Script to Apply Paragraph and Character Styles from Markdown
// This script applies the same paragraph style to both lines of a callout block.

(function main() {
    if (app.documents.length === 0) { alert("Please open a document and try again."); return; }
    var doc = app.activeDocument;

    // --- STYLE DEFINITIONS ---
    var paragraphStyles = [
        { find: "^######\\s", style: "H6" }, { find: "^#####\\s", style: "H5" },
        { find: "^####\\s", style: "H4" }, { find: "^###\\s", style: "H3" },
        { find: "^##\\s", style: "H2" }, { find: "^#\\s", style: "H1" },
        { find: "^>\\s?\\[!Note\\]", style: "Callout Note" },
        { find: "^>\\s?\\[!Important\\]", style: "Callout Important" },
        { find: "^>\\s?\\[!Tip\\]", style: "Callout Tip" },
        { find: "^>\\s?\\[!Warning\\]", style: "Callout Warning" },
        { find: "^>\\s?", style: "Block Quote" },
        { find: "^\\d+\\.\\s", style: "Numbered List" }, { find: "^-\\s", style: "Bulleted List" }
    ];

    var calloutBodyMap = {
        "Callout Note": "Callout Note",
        "Callout Important": "Callout Important",
        "Callout Tip": "Callout Tip",
        "Callout Warning": "Callout Warning"
    };

    // ** RESTORED **
    var characterStyles = [
        { find: "\\*\\*\\*(.+?)\\*\\*\\*", style: "Italic Bold" },
        { find: "\\*\\*([^*]+?)\\*\\*", style: "Bold" },
        { find: "\\*([^*]+?)\\*", style: "Italic" },
        { find: "==(.+?)==", style: "Highlight" },
        { find: "\\~\\~(.+?)\\~\\~", style: "Strikethrough" },
        { find: "`(.+?)`", style: "Inline Code" }
    ];

    function applyParagraphStyles() {
        var allStories = doc.stories;
        for (var i = 0; i < allStories.length; i++) {
            var story = allStories[i];
            for (var j = 0; j < story.paragraphs.length; j++) {
                var para = story.paragraphs[j];
                var matched = false;
                for (var k = 0; k < paragraphStyles.length; k++) {
                    if (new RegExp(paragraphStyles[k].find).test(para.contents)) {
                        var pStyle = doc.paragraphStyles.itemByName(paragraphStyles[k].style);
                        if (pStyle.isValid) para.appliedParagraphStyle = pStyle;
                        matched = true;
                        break;
                    }
                }
                if (!matched && j > 0) {
                    var prevParaStyleName = story.paragraphs[j - 1].appliedParagraphStyle.name;
                    var bodyStyleName = calloutBodyMap[prevParaStyleName];
                    if (bodyStyleName && /^>\\s?/.test(para.contents)) {
                        var bodyStyle = doc.paragraphStyles.itemByName(bodyStyleName);
                        if (bodyStyle.isValid) para.appliedParagraphStyle = bodyStyle;
                    }
                }
            }
        }
    }

    function applyCharacterStyles() {
        for (var k = 0; k < characterStyles.length; k++) {
            var c_rule = characterStyles[k];
            var c_style = doc.characterStyles.itemByName(c_rule.style);
            if (!c_style.isValid) continue;
            app.findGrepPreferences = null; app.changeGrepPreferences = null;
            app.findGrepPreferences.findWhat = c_rule.find;
            app.changeGrepPreferences.changeTo = "$1";
            app.changeGrepPreferences.appliedCharacterStyle = c_style;
            doc.changeGrep();
        }
    }

    try {
        applyParagraphStyles();
        applyCharacterStyles();
        alert("Markdown styling has been applied!");
    } catch (e) { alert("An error occurred: " + e); }
})();