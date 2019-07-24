/**
 * Custom javascript for redmine
 * Agil board
 */

/**
 * Get month id by name
 * @param $month
 */
function getMonthByName($month) {
    var month = [];

    // Replacing umlauts
    $month = $month
        .replace(/\u00c4/g, 'Ae')
        .replace(/\u00e4/g, 'ae')
        .replace(/\u00d6/g, 'Oe')
        .replace(/\u00f6/g, 'oe')
        .replace(/\u00dc/g, 'Ue')
        .replace(/\u00fc/g, 'ue')
        .replace(/\u00df/g, 'ss')
    ;

    month['Januar'] = 0;
    month['Februar'] = 1;
    month['Maerz'] = 2;
    month['April'] = 3;
    month['Mai'] = 4;
    month['Juni'] = 5;
    month['Juli'] = 6;
    month['August'] = 7;
    month['September'] = 8;
    month['Oktober'] = 9;
    month['November'] = 10;
    month['Dezember'] = 11;

    return month[$month];
}

// Project Info-Box - Legend - Revolver
$projectInfoBox = $('<div id="project-info-box">');
$('#wrapper3').prepend($projectInfoBox);

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

// Deadline highlighting
$dateToday = new Date();
$dateToday.setHours(0,0,0,0);
$swimlanes = $('.agile-board .issues-board .swimlane');
$swimlanes.each(function(){
    $swimlane = $(this);
    $swimlane.find('.issue-card').each(function(){
        $task = $(this);
        $taskAttributes = $.map($task.find('.attributes:not(:empty)').html().trim().split('<br>'), $.trim);
        $.each($taskAttributes, function(){
            $attr = $.trim(this);
            // Go on if "this" is not empty
            if ($attr) {
                $attr = $('<div>' + $attr + '</div>');
                $attr = $attr.text();
                $attr = $.map($attr.split(':'), $.trim);

                // Handle estimate date
                if ($attr[0] === 'Abgabedatum') {
                    $dateParts = $attr[1].split(' ');
                    $date = new Date($dateParts[2], getMonthByName($dateParts[1]), $dateParts[0]);
                    if ($date < $dateToday) {
                        $task.addClass('issue-deadline-expired');
                    }
                }
            }
        });
    });
});

// Add revolver information to project info box
$projectInfoBox.append('<div class="project-info-module project-revolver"><h3>Revolver</h3></div>');
$projectInfoBox.children('.project-revolver').append('<ul>');
$projectInfoBox.find('.project-revolver ul').append('<li>AHK-Upgrade: 0403-1081C</li>');
$projectInfoBox.find('.project-revolver ul').append('<li>FMP-Upgrade und Weiterentwicklung: 0403-1082-C</li>');

// Add urgent tasks to project info box
$tasksUrgent = $('.issue-card.issue-urgent');
$boxTasksUrgent = $('<div class="project-info-module project-tasks project-tasks-urgent">')
    .append('<h3>Urgents</h3>')
    .append('<ul>');
if ($tasksUrgent.length) {
    $tasksUrgent.each(function(){
        $taskId = $(this).find('.issue-id strong').clone();
        $taskTitle = $(this).find('.name a').clone();
        $boxTasksUrgent.children('ul').append($('<li>').append($taskId).append(' ').append($taskTitle));
    });
} else {
    $boxTasksUrgent.append('<p>No urgents right now</p>');
}
$projectInfoBox.append($boxTasksUrgent);

// Add launches to project info box
$tasksLaunches = $('.issue-card .name a:contains("Launch")').closest('.issue-card');
$boxTasksLaunches = $('<div class="project-info-module project-tasks project-tasks-launches">')
    .append('<h3>Launches</h3>')
    .append('<ul>');
if ($tasksLaunches.length) {
    $tasksLaunches.each(function() {
        $taskId = $(this).find('.issue-id strong').clone();
        $taskTitle = $(this).find('.name a').clone();
        $boxTasksLaunches.children('ul').append($('<li>').append($taskId).append(' ').append($taskTitle));
    });
} else {
    $boxTasksLaunches.append('<p>No launches right now</p>');
}
$projectInfoBox.append($boxTasksLaunches);

// Hide all swimlanes on start
$('.swimlane .toggle-all').first().trigger('click');
// Show only swimlane "Sprint"
$('.swimlane .expander').siblings('a:contains("Sprint")').siblings('.expander').trigger('click');