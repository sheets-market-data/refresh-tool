# The Sheets Market Data Refresh Tool

This repository is for the Refresh Tool by [Sheets Market Data](https://sheetsmarketdata.com).

## What it is for

This tool was created to help assist users of the [Sheets Market Data add-on for Google Sheets](https://chrome.google.com/webstore/detail/sheets-market-data/eaaklkdlnoijenkocookfipklgkdhjkg) to have the ability to refresh their data at periodic intervals without having to manually do so. 

One of the challenges of working with spreadsheets and data that can get stale quickly is how to refresh your spreadsheet. Doing a [Google search for how to refresh your spreadsheet](https://www.google.com/search?q=how+to+refresh+google+spreadsheet) shows just how much of a pain it is. Common attempts to address this issue include [manually deleting data and undoing it](https://webapps.stackexchange.com/a/66683), [hacking together custom functions that include time functions](https://stackoverflow.com/questions/23177356/how-to-force-new-google-spreadsheets-to-refresh-and-recalculate), or creating your own scripts to run periodically. All of these solutions either don't work, require a lot of manual work, or require a knowledge of coding and working with Google Scripts.

That's why we're releasing our Refresh Tool. The Refresh Tool is a completely free, open source tool to help you automatically refresh you Google sheets so that you have the latest data. It works out of the box with the Sheets Market Data add-on but can also be configured to work with other add-ons or functions.

## Why it is not included in the add-on

This tool was originally intended to be apart of our add-on but Google places [restrictions on add-ons using time-based triggers](https://developers.google.com/gsuite/add-ons/concepts/triggers#restrictions_2) that are much stricter than for regular users. Therefore, instead of releasing a feature that we didn't think would make our customers happy, we decided to open source it so that they could get the best experience possible.

## How to Install

The first step is to open up the sheet you want to use the Refresh Tool in. Next, click the menu Tools > Script editor.

![script editor screenshot](/screenshots/script-editor.png)

This will open up a new window with an empty Google Script editor view.

![google script editor view](/screenshots/google-script-editor-view.png)

Delete all of the existing code in the editor. Then copy and paste the code located in the [Code.js](Code.js) file in this repository into the blank editor. Save the file.

It will ask you for a name for this project, choose whatever name you want.

Next, go to File > New > HTML file.

![new HTML file](/screenshots/new-html-file.png)

It will then ask you to enter a new file name. **Important**, set the file name as *RefreshRate* (leave off the .html extension).

![refresh rate filename](/screenshots/refresh-rate-filename.png)

This will open a new html file with some code in it. Delete all the code in this file. Then open up the file in this respository called [RefreshRate.html](RefreshRate.html) and copy and paste all of the code in this file into the empty html file in the Google Script editor. Save this file.

You are now ready to use the Refresh Tool!

## How to Use

After installing the Refresh Tool for the first time, you'll have to reload your spreadsheet's browser page. If everything was installed properly, you should now see a new menu in your spreadsheet called *Sheets Market Data Refresh Tool*.

![sheets market data refresh tool menu](/screenshots/refresh-tool-menu.png)

To use the tool, select the menu Sheets Market Data Refresh Tool > Set Refresh Rate.

---

#### First Use

If this is the first time setting it up, Google sheets will ask for your permission to run the script.

Click Continue, then select your user account, and allow the tool access.

---

A side bar menu should now open up on the righthand side of your sheet.

![sidebar](/screenshots/sidebar.png)

This sidebar menu allows you to set the refresh rate you want (1 minute, 5 minutes, 15 minutes, 30 minutes, or 1 hour) and a schedule for what hours to run the refreshes (optional).

Once you've set your desired refresh rate and schedule, the Sheets Market Data add-on functions in your sheet will be automatically refreshed accordingly!

## Limitations

Please be aware that there are [limitations and quotas for Google scripts and add-ons](https://developers.google.com/apps-script/guides/services/quotas). The ones of note for this particular tool are the *URL fetch calls* and *Triggers total runtime*. If you are using this tool with the Sheets Market Data add-on, we offer better ways to avoid these limits by using [data ranges](https://sheetsmarketdata.com/docs/pro-features/#data-range).

If you run into errors telling you you've reached a quota or limitation, try using a less frequent refresh rate or a more limited refresh schedule.

## License

[MIT License](LICENSE)


## More Information

For more information about the Sheets Market Data add-on, [visit our website](https://sheetsmarketdata.com). For additional details and documentation for the Refresh Tool, [click here](https://sheetsmarketdata.com/docs/refresh-tool).