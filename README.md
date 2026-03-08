# Markdown-to-InDesign-Styles
Converts imported Markdown into paragraph and character styles using two .jsx scripts. Feel free to make suggestions, changes, or use as you wish. This is primarily based on the video (Markdown to InDesign: From Plain to Formatted Fast)[https://www.youtube.com/watch?v=OBwhNFN69Ps] by Luminous Works Training on YouTube, but those scripts kept throwing errors I couldn't solve so I made my own.

## How to Use

This uses two scripts, *allframes-apply-markdown-styles.jsx* and *allframes-remove-markdown-styles.jsx*. The first simply uses regex/GREP to apply the character and paragraph styling to the Markdown content, and the second retains styling but removes the syntax. Thus for this to work you must first apply styling and then remove syntax. Place the scripts in the InDesign User scripts folder and click them in that order.

## Acceptable Syntax

Supported syntax is as follows, and corresponds to a character/paragraph style. I have this in the document *MDTester.txt* as well so you can verify this.

```
# H1
## H2
### H3
#### H4
##### H5
###### H6
>Block quote
- Unordered list
1. Ordered list

>[!Note]
>Note callout

>[!Important]
>Important callout

>[!Tip]
>Tip callout

>[!Warning]
>Warning callout

*Italic*
**Bold**
***I think this is called oblique?***
==Highlight==
~~Strikethrough~~
`Inline code`
```
