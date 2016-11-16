Date.calendar = {
    weeks: {},
    months: {
        0: "Январь",
        1: "Февраль",
        2: "Март",
        3: "Апрель",
        4: "Май",
        5: "Июнь",
        6: "Июль",
        7: "Август",
        8: "Сентябрь",
        9: "Октябрь",
        10: "Ноябрь",
        11: "Декабрь"
    },
    current: {
        week: 0,
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    }
};

Date.getCountDaysOfMonths = function(month) {

    var date = new Date().setMonth(month);
    return new Date(date).toEndMonth().getDate();

};

Date.prototype.toDDMMYYYY = function() {

    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();

    return (day < 10 ? "0" + day : day) + "." + (month < 10 ? "0" + month : month) + "." + year;

};

Date.prototype.toDDMM = function() {

    var day = this.getDate();
    var month = this.getMonth() + 1;

    return (day < 10 ? "0" + day : day) + "." + (month < 10 ? "0" + month : month);

};

Date.prototype.fromDDMMYYYY = function(DDMMYYYY) {

      console.log(DDMMYYYY);

};

Date.prototype.addDays = function(countDays) {

    this.setDate(this.getDate() + countDays);
    return this;

};

Date.prototype.addMilliseconds = function(countMilliseconds) {
    
    this.setMilliseconds(this.getMilliseconds() + countMilliseconds);
    return this;

};

Date.prototype.toStartWeek = function() {


    if (this.getDay() == 0) {
        this.addDays(-6);
    }
    else {
        this.addDays(1 - this.getDay());
    }

    this.setHours(0, 0, 0, 0);
    return this;

};

Date.prototype.setWeek = function(week) {
    
    var january = new Date(this.setMonth(0)).toStartMonth();
    january.addDays(7*week).toStartWeek();
    return january;
    
};

Date.prototype.toEndWeek = function() {

    this.addDays(8 - this.getDay());
    this.setHours(0,0,0,-1);
    return this;

};

Date.prototype.toStartMonth = function() {

    this.setDate(1);
    this.setHours(0,0,0,0);
    return this;

};

Date.prototype.toEndMonth = function() {

    var currentMonth = this.getMonth();

    this.setDate(1);
    this.setMonth(currentMonth + 1);
    this.setHours(0,0,0,-1);
    return this;

};

function init() {

    var numberWeek = 0;
    var week = new Date(new Date().setMonth(0)).toStartMonth().toStartWeek();
    var now = new Date().getTime();

    do {

        var name;

        var startWeek = new Date(week);
        var endWeek = new Date(week.addDays(7).addMilliseconds(-1));

        if (startWeek.getTime() <= now && now <= endWeek.getTime()) {
            Date.calendar.current.week = numberWeek;
        }

        name = startWeek.toDDMM() + " - ";
        name += endWeek.toDDMM();

        Date.calendar.weeks[numberWeek++] = {
            timestamp: startWeek.getTime(),
            name: name
        };

        week.addMilliseconds(1);

    } while (week.getFullYear() == new Date().getFullYear());

}

init();