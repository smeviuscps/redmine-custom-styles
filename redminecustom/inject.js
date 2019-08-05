var date = new Date();
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://cdn.jsdelivr.net/gh/smeviuscps/redmine-custom-styles/redminecustom/public/agile-board.js?" + date.getTime(), true);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        eval(xhr.responseText);
    }
}
xhr.send();


var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId)) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://rawcdn.githack.com/smeviuscps/redmine-custom-styles/3eed6f3e163cfaa3369a667016286dc46777c66c/redminecustom/public/agile-board.css';
    link.media = 'all';
    head.appendChild(link);
}
