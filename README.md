# WildseaDiceRoller
A dice roller extension for Google Sheets, which reports results according to the rules of _[The Wildsea](https://felixisaacs.itch.io/thewildsea)_, by Felix Isaacs.

Intended for use with the [Wildsea Virtual Play Surface](https://docs.google.com/spreadsheets/d/1LmRh8cXnqyB7vVjNx4U6LgOlbrxmdbZ7ykqIhFw9Tus/edit?gid=1272508559#gid=1272508559)

This extension adds a custom menu to the spreadsheet that makes up the Virtual Play Surface. It allows you to roll up to 6d6 and to input how many highest rolls to cut.

Rolls and their results are reported in a dialogue box, and recorded to a "Rolls" sheet (which is created automatically if none exists).

**Important note:** By default, the name of the roller that is recorded to the "Rolls" sheet is the name of the active sheet at the time of the roll. For accurate recording, ensure your character sheet is selected when you roll. This behaviour can be changed to instead prompt for the roller's name every time by un/commenting out several lines of code (see the source).

## How to Add to the Virtual Play Surface
To use this script, follow these instructions:
1. Log in to your Google account. (This script does not work if you are not logged in.)
2. Open your copy of the Wildsea Virtual Play Surface. Go to the 'Extensions' menu and click 'Apps Script'.
3. Create a new script file. Name it 'Code' (or whatever).
4. Delete the contents of the new file. Paste in the source code from this repository.
5. Save your Apps Script project.
6. Refresh your virtual play surface. The apps script tab/window will close.
7. You should now see a custom menu labeled 'Action Roll'.
8. Try rolling the dice from the Action Roll menu. You will be prompted to authorize the script:
- Click "OK"
- If you get a warning that the app is unverified, bypass it: click the small link at the bottom left that says "Advanced", then the small link at the bottom that says "Go to [the name of your Apps Script] (unsafe)". (Ordinarily this would be a risky thing to do. You should check my code here before using it, of course.)
- Choose the Google account you're using with the virtual play surface
- Click "Allow"
- The authorization step cancels your first attempt to run the script. Try rolling again to make sure it works.
9. The dice roller is now installed!

For the dice roller to work for each player, the following need to be true:
- The player must be signed in to a Google account
- The player's Google account must have Edit privileges over the virtual play surface
- The player must authorize the script

## Copyright
Copyright 2024, Trystan Goetze
Licence: MIT https://opensource.org/license/MIT

A major inspiration and the source of some lines of code is the [basic dice roller](https://script.google.com/u/0/home/projects/1HuMPfc-sfehoZ06KFVI39J5dCr7kLAm7yxZyAc0tDw8NM1ER8FN8igMx/edit) developed by Alice Keeler.

Originally inspired way back when by a [tweet from Mike Shea (@SlyFlourish)](https://twitter.com/SlyFlourish/status/1262912502679158786) about using Slides as a VTT alternative.
