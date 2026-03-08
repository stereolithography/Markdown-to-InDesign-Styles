// InDesign .jsx Script to Remove Markdown Syntax Characters
// This script uses paragraph styles to reliably clean multi-line callouts.

(function main() {
    if (app.documents.length === 0) { alert("Please open a document and try again."); return; }
    var doc = app.activeDocument;
    var boldStyle = doc.characterStyles.itemByName("Bold");

    if (!boldStyle.isValid) {
        alert("Warning: Character style 'Bold' not found. Callout titles will not be styled.");
    }

    var calloutTypes = ["Note", "Warning", "Important", "Tip"];

    // --- SCRIPT EXECUTION ---
    try {
        // --- STEP 1: Precisely clean up callouts, type by type ---
        for (var i = 0; i < calloutTypes.length; i++) {
            var type = calloutTypes[i];
            var pStyle = doc.paragraphStyles.itemByName("Callout " + type);
            if (!pStyle.isValid) continue;

            app.findGrepPreferences = null;
            app.changeGrepPreferences = null;

            // 1a: Find and transform the TITLE line for this callout type
            app.findGrepPreferences.findWhat = "^>\\s?\\[!" + type + "\\]";
            app.findGrepPreferences.appliedParagraphStyle = pStyle;
            app.changeGrepPreferences.changeTo = type;
            if (boldStyle.isValid) {
                app.changeGrepPreferences.appliedCharacterStyle = boldStyle;
            }
            doc.changeGrep();

            // 1b: Find and clean the BODY line(s) for this callout type
            app.findGrepPreferences.findWhat = "^>\\s?";
            app.changeGrepPreferences.changeTo = "";
            app.changeGrepPreferences.appliedCharacterStyle = app.characterStyles.item("[None]");
            doc.changeGrep();
        }

        // --- STEP 2: Clean up all other generic syntax ---
        // ** RESTORED **
        var genericRules = [
            // Character Syntax
            { find: "\\*\\*\\*(.+?)\\*\\*\\*", change: "$1" },
            { find: "\\*\\*([^*]+?)\\*\\*", change: "$1" },
            { find: "\\*([^*]+?)\\*", change: "$1" },
            { find: "==(.+?)==", change: "$1" },
            { find: "\\~\\~(.+?)\\~\\~", change: "$1" },
            { find: "`(.+?)`", change: "$1" },
            // Paragraph Syntax
            { find: "^######\\s", change: "" }, { find: "^#####\\s", change: "" },
            { find: "^####\\s", change: "" }, { find: "^###\\s", change: "" },
            { find: "^##\\s", change: "" }, { find: "^#\\s", change: "" },
            { find: "^>\\s?", change: "" }, // For any remaining regular blockquotes
            { find: "^\\d+\\.\\s", change: "" }, { find: "^-\\s", change: "" }
        ];

        for (var j = 0; j < genericRules.length; j++) {
            app.findGrepPreferences = null;
            app.changeGrepPreferences = null;
            app.findGrepPreferences.findWhat = genericRules[j].find;
            app.changeGrepPreferences.changeTo = genericRules[j].change;
            doc.changeGrep();
        }

        app.findGrepPreferences = null;
        app.changeGrepPreferences = null;
        alert("Markdown syntax has been removed!");

    } catch (e) {
        alert("An error occurred: " + e);
    }
})();