/**
 * @OnlyCurrentDoc
 */

function createMenu() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('Sheets Market Data Refresh Tool')
    .addItem('Set Refresh Rate', 'menuSetRefreshRate')
    .addSeparator()
    .addItem('More Info', 'menuMoreInfo');
  menu.addToUi();
}

function onInstall() {
  createMenu();
}

function onOpen() {
  createMenu();
}

function menuMoreInfo() {
  var ui = SpreadsheetApp.getUi();
  var alert = ui.alert(
    'More Info', 
    'This tool works with the Sheets Market Data add-on. For more information about the add-on, visit the website:\n\n https://sheetsmarketdata.com', 
    ui.ButtonSet.OK
  );
}

function menuSetRefreshRate() {
  var html = HtmlService.createHtmlOutputFromFile('RefreshRate')
    .setTitle('Refresh Rate')
    .setWidth(300);
  SpreadsheetApp.getUi()
    .showSidebar(html);
}

function getCurrentRefreshRate() {
  var userProperties = PropertiesService.getUserProperties();
  var time = userProperties.getProperty('REFRESH_TRIGGER_VALUE');
  if (!time) {
    return '';
  } else {
    return time;
  }
}

function getRefreshRateTimes() {
  var userProperties = PropertiesService.getUserProperties();
  var allUserProperties = userProperties.getProperties();
  var startTime = allUserProperties['REFRESH_START_TIME'];
  var endTime = allUserProperties['REFRESH_END_TIME'];
  var response = {
    start: startTime,
    end: endTime,
  };
  return response;
}

function createTimeTrigger(rate, start, end) {
  if (!rate || rate === '') {
    return;
  }
  var userProperties = PropertiesService.getUserProperties();
  var triggerId = userProperties.getProperty('REFRESH_TRIGGER');

  if (triggerId) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var triggers = ScriptApp.getUserTriggers(ss);
    for (var i = 0; i < triggers.length; i++) {
      var id = triggers[i].getUniqueId();
      if (id === triggerId) {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
  }
  var newTrigger = ScriptApp.newTrigger('refresh').timeBased().everyMinutes(parseInt(rate)).create();
  userProperties.setProperties({
    'REFRESH_TRIGGER': newTrigger.getUniqueId(),
    'REFRESH_TRIGGER_VALUE': rate,
    'REFRESH_START_TIME': start,
    'REFRESH_END_TIME': end,
  });
}

function convertTo24Hour(time) {
  var hours = parseInt(time.substr(0, 2));
  if(time.indexOf('am') != -1 && hours == 12) {
      time = time.replace('12', '0');
  }
  if(time.indexOf('pm') != -1 && hours < 12) {
      time = time.replace(hours, (hours + 12));
  }
  return time.replace(/(am|pm)/, '');
}

function refresh() {
  var userProperties = PropertiesService.getUserProperties();
  var allUserProperties = userProperties.getProperties();
  var startTime = allUserProperties['REFRESH_START_TIME'];
  var endTime = allUserProperties['REFRESH_END_TIME'];
  if (startTime && endTime) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timeZone = ss.getSpreadsheetTimeZone();
    startTime = convertTo24Hour(startTime);
    var startHours = startTime.split(':')[0];
    var startMinutes = startTime.split(':')[1];
    var start = new Date();
    start.setHours(startHours);
    start.setMinutes(startMinutes);
    var startInZone = Utilities.formatDate(start, timeZone, 'MMMM dd, yyyy '+ startHours + ':' + startMinutes + ':00 Z');
    start = new Date(startInZone);
    start = start.getTime();
    endTime = convertTo24Hour(endTime);
    var endHours = endTime.split(':')[0];
    var endMinutes = endTime.split(':')[1];
    var end = new Date();
    end.setHours(endHours);
    end.setMinutes(endMinutes);
    var endInZone = Utilities.formatDate(end, timeZone, 'MMMM dd, yyyy '+ endHours + ':' + endMinutes + ':00 Z');
    end = new Date(endInZone);
    end = end.getTime();
    var now = new Date();
    var nowInZone = Utilities.formatDate(now, timeZone, 'MMMM dd, yyyy HH:mm:ss Z');
    now = new Date(nowInZone);
    now = now.getTime();
    if ((now > start) && (now < end)) {
      recalculate();
    }
  } else {
    recalculate();
  }
}

function recalculate() { 
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0;i < sheets.length;i++) {
    refreshSheet(sheets[i]);
  }
}

function refreshSheet(sheet) {
  var s = SpreadsheetApp.getActiveSheet();
  if (typeof sheet !== "undefined") {
    s = sheet
  }
  var data = s.getDataRange();
  var cells = findFunctions(data);
  for (var i = 0;i < cells.length;i++) {
    var formula = cells[i].getFormula();
    cells[i].clearContent();
    SpreadsheetApp.flush();
    Utilities.sleep(50);
    cells[i].setValue(formula);
  }
}

function findFunctions(data) {
  var allFormulas = data.getFormulas();
  var response = [];
  for (var i = 0;i < allFormulas.length;i++) {
    for (var j = 0;j < allFormulas[i].length;j++) {
      if (
        allFormulas[i][j].indexOf('STOCK_FUNDAMENTALS') > -1 ||
        allFormulas[i][j].indexOf('OPTIONS_DATA') > -1
      ) {
        response.push(data.getCell(i + 1, j + 1));
      }
    }
  }
  return response;
}