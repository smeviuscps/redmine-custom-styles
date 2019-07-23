/*
 * _______________
 * |       .-.   |
 * |      // ``  |
 * |     //      |
 * |  == ===-_.-'|
 * |   //  //    |
 * |__//_________|
 *
 * Copyright (c) ${YEAR} familie-redlich :systeme <systeme@familie-redlich.de>
 * @link     http://www.familie-redlich.de
 *
 *
 */
(function () {
// Status badget - Tracker Status - Add css class

// Stories
$issueCardTrackerStories = $('div.agile-board.autoscroll td.issue-status-col .issue-card .issue-id *:contains("AHK-Story")').parents('.issue-card');
$issueCardTrackerStories.addClass('issue-story');

// Urgents
$issueCardTrackerUrgents = $('div.agile-board.autoscroll td.issue-status-col .issue-card .issue-id *:contains("AHK-Urgent")').parents('.issue-card');
$issueCardTrackerUrgents.addClass('issue-urgent');

// Bug
$issueCardTrackerBugs = $('div.agile-board.autoscroll td.issue-status-col .issue-card .issue-id *:contains("AHK-BUG")').parents('.issue-card');
$issueCardTrackerBugs.addClass('issue-bug');

// My tasks
$userLink = $('#loggedas a.user.active').attr('href');
$user = $userLink.replace(/[^0-9]/g, '');

$userTasks = $('div.agile-board.autoscroll td.issue-status-col .issue-card .assigned-user a[href="' + $userLink + '"]').parents('.issue-card');
$userTasks.addClass('issue-my-task');

// Project Info-Box - Legend - Revolver
$projectInfoBox = $('<div id="project-info-box">');
$projectInfoBox.append('<div class="project-revolver"><h3>Revolver</h3></div>');
$projectInfoBox.children('.project-revolver').append('<ul>');
$projectInfoBox.find('.project-revolver ul').append('<li>AHK-Upgrade: 0403-1081C</li>');
$projectInfoBox.find('.project-revolver ul').append('<li>FMP-Upgrade und Weiterentwicklung: 0403-1082-C</li>');
$('#wrapper3').prepend($projectInfoBox);

// Deadline highlighting
$dateToday = new Date();
$dateToday.setHours(0,0,0,0);
$swimlanes = $('.agile-board .issues-board .swimlane');
$swimlanes.each(function(){
    $swimlane = $(this);
    $swimlane.find('.issue-card').each(function(){
        $task = $(this);
        $date = $task.find('.attributes:not(:empty)').text().replace('Abgabedatum:', '');
        $date = new Date($.trim($date));
        if ($date < $dateToday) {
            $task.addClass('issue-deadline-expired');
        }
    });
});

// Project Info-Box - Legend - Revolver
$projectInfoBox = $('<div id="project-info-box">');
$projectInfoBox.append('<div class="project-revolver"><h3>Revolver</h3></div>');
$projectInfoBox.children('.project-revolver').append('<ul>');
$projectInfoBox.find('.project-revolver ul').append('<li>AHK-Upgrade: 0403-1081C</li>');
$projectInfoBox.find('.project-revolver ul').append('<li>FMP-Upgrade und Weiterentwicklung: 0403-1082-C</li>');
$('#wrapper3').prepend($projectInfoBox);
})();
