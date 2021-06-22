// Array.prototype.remove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
// };

export function uniqid() {
  var ts = String(new Date().getTime()),
    i = 0,
    out = "";
  for (i = 0; i < ts.length; i += 3) {
    out += Number(ts.substr(i, 2)).toString(36);
  }
  return "d" + out;
}

function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = strDelimiter || ",";
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
    strDelimiter +
    "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    '(?:"([^"]*(?:""[^"]*)*)"|' +
    // Standard fields.
    '([^"\\' +
    strDelimiter +
    "\\r\\n]*))",
    "gi"
  );
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return arrData;
}

export function CSV2JSON(csv) {
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      objArray[i - 1][key] = array[i][k];
    }
  }

  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");

  return str;
}


export function CSV2JSONUpdated(csv) {
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length-1; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      if (key == 'attributes') {
        array[i][k] = array[i][k].replace('[', '');
        array[i][k] = array[i][k].replace(']', '');
        var str = array[i][k];
        var indices = [];
        var indices1 = [];
        for (var j = 0; j < str.length; j++) {
          if (str[j] === "{") indices.push(j);
          if (str[j] === "}") indices1.push(j);
        }
        var arr = [];
        for (var v = 0; v < indices.length; v++) {
          arr.push(array[i][k].substring(indices[v], indices1[v] + 1));
        }
        array[i][k] = arr;
      }
      objArray[i - 1][key] = array[i][k];
    }
  }
  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");
  return str;
}


/*

$(function() {
  $(document).on("input", "#loc", function() {
    var loc = $("#loc").val();
    $.ajax({
      type: "GET",
      url: "http://pagecabinet.com/locationapi.php",
      data: { q: loc },
      success: function(res) {
        var locarr = [];
        for (var i = 0; i < res.predictions.length; i++) {
          locarr[i] = res.predictions[i].description;
        }
        $("#loc").autocomplete({ source: locarr });
      }
    });
  });
  $(document).on("click", ".sub-menu", function() {
    $(this)
      .find(".arrow")
      .toggleClass("sub-open");
  });
  // Remove Nav
  $(document).on("click", "#toggleMenu", function() {
    $("#page-wrapper").toggleClass("toggleNav");
    $("#sd-navbar").toggleClass("toggleNav2");
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  });
});  */

export const registeredProductsPageLimit = 1000;
export const suppliersPageLimit = 100;
export const outletsPageLimit = 100;
export const couriersPageLimit = 100;
export const templatesPageLimit = 100;


export function var_check(v) {
  if (typeof v !== "undefined" && v !== "" && v !== null) return true;
  else return false;
}


export function var_check_updated(v) {
  if (v !== "undefined" && v !== "null" && v !== "" && v !== null) return true;
  else return false;
}


function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function current_datetime() {
  var currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
}

//$(document).ready(() => {});
