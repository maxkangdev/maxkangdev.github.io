---
categories:
  - productivity|생산성
date: 2025-01-15T21:20:37+09:00
draft: false
tags:
  - obsidian
title: 옵시디언으로 2025 Daily Note / Yearly Note 설정하기
---

## Overview

I've tried various note-taking apps like Notion, Logseq, and Apple Notes, but as a developer, the one I found most satisfying is Obsidian.  
It offers a wide variety of plugins/themes, a minimalist design, and above all, it is markdown-based, making it incredibly convenient to use.  

To kick off the new year, 2025, I made some changes to my Obsidian setup.  
In this post, I’ll share the plugins I frequently use and how I configure them.  

By the end, we'll create the following pages:

### Todo
![](Screenshot%202025-01-15%20at%209.53.21%20PM.png)

### Daily Note
- Link to the 2025 Tracker
- Workout log
- This week’s tasks + link to Todo
- Journal
- Notes created today
- Notes modified today

![](Screenshot%202025-01-15%20at%209.54.28%20PM.png)

### 2025 Tracker
- Workouts
- Cardio
- Books

![](Screenshot%202025-01-15%20at%209.27.42%20PM.png)

---

## Todo
Creating a Todo is very simple. You can open any page and create one using markdown syntax.  
However, with the Tasks plugin, you can add features like setting due dates, recurring tasks, and more.  

Additionally, you can aggregate tasks from daily notes into one view later on. 😊

---

## Daily Note

While Obsidian provides a built-in daily note feature, I use the following plugins to enhance it:  
- Templater  
- Calendar  
- Tasks  
- Periodic Notes  
- Dataview  

First, create the following folders and then modify the Daily Notes settings in Periodic Notes as follows:  
- Template: `Templates/Daily Note Template.md`
- Location: `1. Planner/1-2. Daily`

> Feel free to change the template file and folder names, but please maintain the format. 😊  

![](Screenshot%202025-01-15%20at%209.39.28%20PM.png)

Next, copy the template below:  
> The information in the frontmatter will be used later for the 2025 Tracker.

````zsh
---
title: <% tp.file.title %>
workout: 
cardio: 
read: 
book: 
write: false
writing: 
tags:
  - daily
---
 [[{{date:YYYY}} | Track {{date:YYYY}} Progress ]]
<%*
const fileName = tp.file.title; // Get the file name (without extension)
const currentDay = new Date(fileName); // Convert file name to Date object
const startOfWeek = new Date(currentDay);

// Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
const dayOfWeek = currentDay.getDay();

// Calculate the difference to the previous Monday (or current Monday if today is Monday)
const diffToMonday = (dayOfWeek + 6) % 7; // Monday as day 0

// Set the start of the week (Monday)
startOfWeek.setDate(currentDay.getDate() - diffToMonday);

// Set the end of the week (Sunday), which is 6 days after Monday
const endOfWeek = new Date(startOfWeek); // Clone startOfWeek to avoid modifying the same object
endOfWeek.setDate(startOfWeek.getDate() + 6); // Correctly add 6 days to the start of the week

// Format the start and end of the week as "YYYY-MM-DD"
const startOfWeekFormatted = startOfWeek.toISOString().split("T")[0];
const endOfWeekFormatted = endOfWeek.toISOString().split("T")[0];

//tR += `Start of the week: ${startOfWeekFormatted}\nEnd of the week: ${endOfWeekFormatted}`;
%>
## Exercise Log 

## Tasks -  [[Todo|Add New Task]]
>[!info] Due This Week 
>```tasks
> due date is between <% startOfWeekFormatted %> and <% endOfWeekFormatted %>
>```

>[!done] Completed Today
>```tasks
>done <% tp.file.title %>
>```
## Journal 


## Notes Created Today
```dataview
List FROM "" WHERE file.cday = date("<% tp.file.title %>") SORT file.ctime desc
```
## Notes Modified Today
```dataview
List FROM "" WHERE file.mday = date("<% tp.file.title %>") SORT file.mtime desc
```

````

Afterward, open the Calendar plugin and click a date. The Daily Note for that date will be automatically created using the above template.  
You’ll see pages generated as shown in the images above.

> The colors and styles might differ slightly; I’ll explain those separately below.

## 2025 Tracker

The 2025 Tracker is essentially the same as the Yearly Note. To utilize the heatmap feature, please install the following plugin:
- Heatmap Calendar

Afterward, create the following folder and update the Yearly Notes settings in Periodic Notes as shown below:
- `Templates/Yearly Note Template.md`
- `1. Planner/1-5. Yearly`

````zsh 
---
title: <% tp.file.title %>
created: <% tp.file.creation_date("YYYY-MM-DD HH:MM") %>
tags:
  - yearly
---
```dataviewjs // PS. remove backslash \ at the very beginning!

dv.span("** 🏋️‍♀️ Workout🦵**") /* optional ⏹️💤⚡⚠🧩↑↓⏳📔💾📁📝🔄📝🔀⌨️🕸️📅🔍✨ */
const calendarData = {
	colors: {    // (optional) defaults to green
		blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], // first entry is considered default if supplied
		green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
		red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
		orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
		pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
		orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
	},
	showCurrentDayBorder: true, // (optional) defaults to true
	defaultEntryIntensity: 4,   // (optional) defaults to 4
	intensityScaleStart: 10,    // (optional) defaults to lowest value passed to entries.intensity
	intensityScaleEnd: 100,     // (optional) defaults to highest value passed to entries.intensity
	entries: [],                // (required) populated in the DataviewJS loop below
}

const colors = { // Custom solid colors for workout types
	"Push": "blue", //  
	"Pull": "green", //  
	"Leg": "red", // 
	default: "orange", // Green for other types
}

//DataviewJS loop
for (let page of dv.pages('"1. Planner/1-2. Daily"').where(p => p.workout)) {
		
	calendarData.entries.push({
		date: page.file.name,     // (required) Format YYYY-MM-DD
		intensity: 100, // (required) the data you want to track, will map color intensities automatically
		content: dv.span(`[](${page.file.name})`),           // (optional) Add text to the date cell
		color: colors[page.workout],          // (optional) Reference from *calendarData.colors*. If no color is supplied; colors[0] is used
	})
}

renderHeatmapCalendar(this.container, calendarData)

```
---
```dataviewjs // PS. remove backslash \ at the very beginning!

dv.span("** 🏃‍♂️ Cardio 🏃‍♂️**") /* optional ⏹️💤⚡⚠🧩↑↓⏳📔💾📁📝🔄📝🔀⌨️🕸️📅🔍✨ */
const calendarData = {
	colors: {    // (optional) defaults to green
		blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], // first entry is considered default if supplied
		green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
		red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
		orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
		pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
		orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
	},
	showCurrentDayBorder: true, // (optional) defaults to true
	defaultEntryIntensity: 4,   // (optional) defaults to 4
	intensityScaleStart: 10,    // (optional) defaults to lowest value passed to entries.intensity
	intensityScaleEnd: 100,     // (optional) defaults to highest value passed to entries.intensity
	entries: [],                // (required) populated in the DataviewJS loop below
}

//DataviewJS loop
for (let page of dv.pages('"1. Planner/1-2. Daily"').where(p => p.cardio)) {
	//dv.span("<br>" + page.file.name) // uncomment for troubleshooting
	calendarData.entries.push({
		date: page.file.name,     // (required) Format YYYY-MM-DD
		intensity: page.cardio, // (required) the data you want to track, will map color intensities automatically
		content: dv.span(`[](${page.file.name})`),           // (optional) Add text to the date cell
		color: "orange",          // (optional) Reference from *calendarData.colors*. If no color is supplied; colors[0] is used
	})
}

renderHeatmapCalendar(this.container, calendarData)

```
---
```dataviewjs // PS. remove backslash \ at the very beginning!

dv.span("** 📚 Reading 📚 **") /* optional ⏹️💤⚡⚠🧩↑↓⏳📔💾📁📝🔄📝🔀⌨️🕸️📅🔍✨ */
const calendarData = {
	colors: {    // (optional) defaults to green
		blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], // first entry is considered default if supplied
		green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
		red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
		orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
		pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
		orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
	},
	showCurrentDayBorder: true, // (optional) defaults to true
	defaultEntryIntensity: 4,   // (optional) defaults to 4
	intensityScaleStart: 10,    // (optional) defaults to lowest value passed to entries.intensity
	intensityScaleEnd: 100,     // (optional) defaults to highest value passed to entries.intensity
	entries: [],                // (required) populated in the DataviewJS loop below
}

//DataviewJS loop
for (let page of dv.pages('"1. Planner/1-2. Daily"').where(p => p.read)) {
	//dv.span("<br>" + page.file.name) // uncomment for troubleshooting
	calendarData.entries.push({
		date: page.file.name,     // (required) Format YYYY-MM-DD
		intensity: page.read, // (required) the data you want to track, will map color intensities automatically
		content: dv.span(`[](${page.file.name})`),           // (optional) Add text to the date cell
		color: "green",          // (optional) Reference from *calendarData.colors*. If no color is supplied; colors[0] is used
	})
}

renderHeatmapCalendar(this.container, calendarData)

```

## 읽은 책
```dataview
TABLE without id 
	rows.book as "책 제목",
	rows.title as "읽은 날짜"
FROM "1. Planner/1-2. Daily"
WHERE contains(file.name, "<% tp.file.title %>") AND book != null
FLATTEN book
GROUP BY book
```

---
```dataviewjs // PS. remove backslash \ at the very beginning!

dv.span("** 🧑‍💻 Write 🧑‍💻 **") /* optional ⏹️💤⚡⚠🧩↑↓⏳📔💾📁📝🔄📝🔀⌨️🕸️📅🔍✨ */
const calendarData = {
	colors: {    // (optional) defaults to green
		blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], // first entry is considered default if supplied
		green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
		red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
		orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
		pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
		orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
	},
	showCurrentDayBorder: true, // (optional) defaults to true
	defaultEntryIntensity: 4,   // (optional) defaults to 4
	intensityScaleStart: 10,    // (optional) defaults to lowest value passed to entries.intensity
	intensityScaleEnd: 100,     // (optional) defaults to highest value passed to entries.intensity
	entries: [],                // (required) populated in the DataviewJS loop below
}

//DataviewJS loop
for (let page of dv.pages('"1. Planner/1-2. Daily"').where(p => p.write)) {
	//dv.span("<br>" + page.file.name) // uncomment for troubleshooting
	calendarData.entries.push({
		date: page.file.name,     // (required) Format YYYY-MM-DD
		intensity: 100, // (required) the data you want to track, will map color intensities automatically
		content: dv.span(`[](${page.file.name})`),           // (optional) Add text to the date cell
		color: "green",          // (optional) Reference from *calendarData.colors*. If no color is supplied; colors[0] is used
	})
}

renderHeatmapCalendar(this.container, calendarData)

```

## 쓴 글 
```dataview
table without id writing as "Writing", title as "Date"
from "1. Planner/1-2. Daily" 
where writing
sort title desc
```

````

Yearly Notes are not auto-generated with a calendar. You need to manually create a file for the year 2025 in the `1. Planner/1-5. Yearly` folder.

Once the file is created, bring up the search bar by pressing `command + p` and type "Insert Template". Select "Yearly Note Template" and then press `command + r` to apply the template automatically.

Initially, the note will be empty, but as you fill in the properties section of your Daily Notes, you'll see the heatmap gradually populate. 😊  
![](Screenshot%202025-01-15%20at%2010.06.46%20PM.png)

Additionally, Dataview is set up to display records of books you've read and writings, as shown below:
![](Screenshot%202025-01-15%20at%2010.07.46%20PM.png)

> For workouts, colors are divided into Push, Pull, and Leg categories. You can modify the code as needed, or just stick with this division for simplicity. 😆

## Style

The appearance of your notes is crucial—if they're not visually appealing, it's harder to stay motivated. 😝  

You can tweak various settings (fonts, colors, etc.) of the Minimal theme using the following plugins:
- Minimal Theme Settings
- Styles Settings

For tasks, you can customize the appearance of items due today or overdue, as shown below:
![](Screenshot%202025-01-18%20at%2012.26.48%20PM.png)

Navigate to `Settings -> Appearance -> CSS snippets` to find a folder for custom CSS. Add the following code to display tasks as shown above:
```zsh
/* Customize the appearance of tasks due today */  
.task-list-item[data-task-status-type="TODO"] .task-due[data-task-due="today"] span,  
.task-list-item[data-task-status-type="IN_PROGRESS"] .task-due[data-task-due="today"] span {  
    background: var(--color-pink);  
    border-radius: 10px;  
    padding: 2px 8px;  
}  
  
/* Customize the appearance of overdue tasks */  
.task-list-item[data-task-status-type="TODO"] .task-due[data-task-due^="past-"] span,  
.task-list-item[data-task-status-type="IN_PROGRESS"] .task-due[data-task-due^="past-"] span {  
    background: var(--color-red);  
    border-radius: 10px;  
    padding: 2px 8px;  
}
```

---


Let's all aim to be more productive in 2025! 🫠
