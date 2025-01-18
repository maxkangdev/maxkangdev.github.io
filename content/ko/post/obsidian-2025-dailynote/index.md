---
categories:
  - productivity|생산성
date: 2025-01-15T21:20:37+09:00
draft: false
tags:
  - obsidian
title: 옵시디언으로 2025 Daily Note / Yearly Note 설정하기
---

## 개요 

Notion, logseq, Apple Note 앱등 여러가지 노트 어플을 써봤지만 개발자로서 제일 마음에 들었던 것은 결국 Obsidian 입니다. 
다양한 plugin/theme 과 미니멀한 디자인.   
그리고 무엇보다 마크다운 기반이기때문에 작성하기도 편리하죠. 

2025 새해를 맞이하면서 Obsidian 설정을 조금씩 바꿔봤는데요.  
본 글에서는 필자가 자주 사용하는 플러그인과 설정방법을 공유해보려고 합니다.  

결과적으로 아래 페이지들을 생성해보겠습니다. 

### Todo 
![](Screenshot%202025-01-15%20at%209.53.21%20PM.png)
### Daily Note
- 2025 Tracker로 가는 링크
- 운동일지
- 이번주 할일 + Todo로 가는 Link
- 일기
- 오늘 작성한 노트 
- 오늘 수정한 노트 

![](Screenshot%202025-01-15%20at%209.54.28%20PM.png)

### 2025 Tracker 
- 운동
- 유산소 
- 책 

![](Screenshot%202025-01-15%20at%209.27.42%20PM.png)


## Todo
Todo 는 매우 간단합니다.  아무 페이지나 열어서 마크 다운 syntax를 사용해서 todo를 생성하면 됩니다.  
하지만 Task plugin을 통해 due date 설정, recurring 설정등 다양한 기능을 추가할 수 있습니다.  

또한, 나중에 daily note에 등록된 Task들을 한군데에 모아서 보여는 것도 가능하죠 :) 

## Daily Note 

데일리 노트의 경우 Obsidian 에서 기본적으로 제공해주는 기능이지만, 이를 더 잘 활용하기 위해서는 저는 다음 plugin들을 설치해서 같이 사용하고 있습니다. 
- Templater
- Calender
- Tasks
- Periodic Notes
- Dataview 

먼저 아래 폴더를 생성한 이후, Periodic Notes의 설정에서 Daily Notes 설정을 다음과 같이 변경해줍니다.
- Templates/Daily Note Template.md
- 1. Planner/1-2. Daily
> Template 파일이름과 폴더 이름은 자유롭게 변경하셔도 되지만 포맷을 유지해주세요 :) 

![](Screenshot%202025-01-15%20at%209.39.28%20PM.png)

이후 아래 template 을 복사해주세요.  
> frontmatter에 있는 정보들을 추후 2025 Tracker에 쓰입니다 .
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
## 일기 


## 오늘 작성한 노트
```dataview
List FROM "" WHERE file.cday = date("<% tp.file.title %>") SORT file.ctime desc
```
## 오늘 수정한 노트
```dataview
List FROM "" WHERE file.mday = date("<% tp.file.title %>") SORT file.mtime desc
```

````

이후 캘린더 플러그인을 열어서 날짜를 누르면 해당 날짜의 Daily Note가 위 템플릿을 사용해서 자동으로 생성됩니다.  
그럼 위에 그려진 그림처럼 페이지가 생성되는 걸 보실 수 있습니다. 
> 색이나 스타일 같은 것이 조금 다를텐데요. 해당 부분은 별도설명을 아래 추가해두었습니다. 

## 2025 Tracker 

2025 Tracker는 결국 Yearly Note 와 동일합니다. Heatmap을 사용하기 위해서 아래 플러그인을 추가로 설치해주세요. 
- Heatmap Calender

 이후 아래 폴더를 생성한 이후, Periodic Notes의 설정에서 Yearly Notes 설정을 다음과 같이 변경해줍니다.
- Templates/Yearly Note Template.md
- 1. Planner/1-5. Yearly

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

Yearly Note는 캘린더를 사용해 자동 생성이 되지않기 떄문에 직접  `1. Planner/1-5. Yearly` 폴더로 이동해서 2025 파일을 생성해줍니다.

이후 command+p 를 통해 search bar를 띄운다임 insert template을 쳐줍니다.  
이후 Yearly Note Template 을 선택, 이후 command + r 을 누르면 자동으로 적용됩니다 :)

처음에는 아무것도 안채워져 있겠지만, Daily Note의 properties 부분을 채워가다 보면 점점 Heatmap이 차오르는것을 보실수 있습니다 :) 
![](Screenshot%202025-01-15%20at%2010.06.46%20PM.png)

추가로 읽은 책과 쓴글을 기록하면 아래처럼 나타나도록 Dataview도 추가되어 있습니다. 
![](Screenshot%202025-01-15%20at%2010.07.46%20PM.png)

>운동의 경우 Push/Pull/Leg 3분할로 색이 나눠지도록 설정해두었는데요. 필요시 코드를 보고 적절하게 바꾸시면 됩니다 😆 귀찮으면 3분할 달리시죠. 


## 스타일

노트에서 가장중요한 부분입니다. 못생기면 쓰기 싫어요 😝  

아래 플러그인들로 minimal theme의 여러가지 설정(폰트, 색상 등)들을 변경 할 수 있습니다.  
- Minimal Theme Settings
- Styles Settings



Task에서 아래처럼 오늘까지인 업무의 경우 색상을 바꿔줄수 있는데요.   
![](Screenshot%202025-01-18%20at%2012.26.48%20PM.png)

Settings -> Appearance -> CSS snippets 에 가시면 custom 하게 설정할수 있는 css 폴더가 있습니다.   
해당 폴더안에 아래 코드를 생성해서 넣어주면 위와같이 표시가 가능합니다. 
```zsh
/* A special color for the 'due' component if it's for today */  
.task-list-item[data-task-status-type="TODO"] .task-due[data-task-due="today"] span,  
.task-list-item[data-task-status-type="IN_PROGRESS"] .task-due[data-task-due="today"] span {  
    background: var(--color-pink);  
    border-radius: 10px;  
    padding: 2px 8px;  
}  
  
/* A special color for overdue due dates */  
.task-list-item[data-task-status-type="TODO"] .task-due[data-task-due^="past-"] span,  
.task-list-item[data-task-status-type="IN_PROGRESS"] .task-due[data-task-due^="past-"] span {  
    background: var(--color-red);  
    border-radius: 10px;  
    padding: 2px 8px;  
}
```


모두 2025년은 조금더 부지런 할 수 있기를 바랍니다  🫠


