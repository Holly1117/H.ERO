window.onload = function () {
    setMenu();
    setCard(null, null, null);
    setSearch();
}

function setMenu() {

    $.getJSON("./json/calendar.json", function (dataList) {
        var $calendar = $("#calendarMenu");
        var calendarMenuTag = [];
        calendarMenuTag.push("<input id=\"menuAll\" class=\"radioInput filter\" type=\"radio\" name=\"calendarRadio\"/ value=\"ALL\" checked=\"checked\">");
        calendarMenuTag.push("<label class=\"radioLabel\" for=\"menuAll\">ALL</label>");
        dataListLength = dataList.length;
        for (let i = dataListLength - 1; i >= 0; i--) {
            let date_yyyy_mm = dataList[i].date_year + "-" + dataList[i].date_month;
            let setCardEventMethod = "setCardEvent(" + dataList[i].date_year + "," + dataList[i].date_month + ")";
            let inputId = "menu" + date_yyyy_mm;
            let menuName = dataList[i].date_year + "年" + dataList[i].date_month + "月";
            let inputTag = "<input onclick=\"" + setCardEventMethod + "\" id=\"" + inputId + "\" class=\"radioInput filter\" type=\"radio\" name=\"calendarRadio\" value=\"" + menuName + "\"/>";
            let labelTag = "<label class=\"radioLabel\" for=\"" + inputId + "\">" + menuName + "</label>";
            calendarMenuTag.push(inputTag + labelTag);
        }
        $calendar[0].innerHTML = calendarMenuTag.join("");
        $("#menuAll").on("click", () => {
            $("#cardList").children().remove();
            setCard(null, null, null);
        });
    });
}

function setCardEvent(year, month) {
    $("#cardList").children().remove();
    setCard(null, year, month);
}

function setSearch() {
    var $searchContainer = $("#searchContainer");
    var searchTag = [];
    var searchBox = "<input id=\"searchText\" type=\"text\" placeholder=\"ゲーム名検索\" minlength=\"1\" required>";
    var searchButton = "<input type=\"submit\" value=\"&#xf002\" onclick=\"searchEvent()\">";
    searchTag.push(searchBox + searchButton);
    $searchContainer[0].innerHTML = searchTag.join("");
}


function searchEvent() {
    $("#cardList").children().remove();
    searchName = $("#searchText").val()
    var radioName = $('input[name="calendarRadio"]:checked').val();
    if (radioName != "ALL") {
        var dateYearMonth = radioName.match("(.*?)年(.*?)月");
        var yearInt = Number(dateYearMonth[1].replace("年", ""));
        var monthInt = Number(dateYearMonth[2].replace("月", ""));
        setCard(searchName, yearInt, monthInt);
    } else {
        setCard(searchName, null, null);
    }
}

function setCard(searchName, argYear, argMonth) {
    $.getJSON("./json/hero.json", function (data) {
        var $carList = $("#cardList");
        var cardListTag = [];

        for (var i in data) {
            var dateYear = data[i].menu_date_year;
            var dateMonth = data[i].menu_date_month;
            var gameName = data[i].game_name;
            if (calendarCheck(argYear, argMonth, dateYear, dateMonth) && searchCheck(searchName, gameName)) {
                var kindsLogo = "";
                if (data[i].game_kinds == "(NS)") {
                    kindsLogo = "<img class=\"hardLogo\" src=\"./image/logo/ns-logo.webp\">";
                } else if (data[i].game_kinds == "(PS4)") {
                    kindsLogo = "<img class=\"hardLogo\" src=\"./image/logo/ps4-logo.webp\">";
                } else if (data[i].game_kinds == "(XBOX)") {
                    kindsLogo = "<img class=\"hardLogo\" src=\"./image/logo/xbox-logo.svg\">";
                } else if (data[i].game_kinds == "(PS5)"){
                    kindsLogo = "<img class=\"hardLogo\" src=\"./image/logo/ps5-logo.webp\">";
                }
                let imageSrc = "./image/game/" + data[i].game_image + ".webp";
                let undefined = "./image/game/undefined.webp";
                let imageTag = "<img class=\"cardImage jsModalVideo\" src=\"" + imageSrc + "\" title=\"" + gameName + "\" onerror=\"this.onerror = null; this.src='" + undefined + "';\">" + kindsLogo;
                let ImageLinkTag = "<a href=\"" + data[i].game_url + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + imageTag + "</a>";
                let aTag = "<a href=\"" + data[i].game_url + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + gameName + "</a>";
                let titleLinkTag = "<p class=\"cardTitle\">" + aTag + "</p>";
                let brandTag = "<div class=\"cardBrand\"><a href=\"" + data[i].brand_url + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + data[i].brand_name + "</a></div>";
                let dateTag = "<div class=\"cardDate\">" + data[i].game_date + "</div>";
                let contentAreaTag = "<div class=\"cardContentArea\">" + brandTag + dateTag + "</div>";
                cardListTag.push("<div class=\"cardItem\">" + ImageLinkTag + titleLinkTag + contentAreaTag + "</div>");
            }
        }
        $carList[0].innerHTML = cardListTag.join("");
    });
}

function calendarCheck(argYear, argMonth, dateYear, dateMonth) {
    if ((!argYear) || (dateYear == argYear && dateMonth == argMonth)) {
        return true
    }
    return false
}

function searchCheck(searchName, gameName) {
    if ((!searchName) || (gameName.indexOf(searchName) != -1)) {
        return true
    }
    return false
}
