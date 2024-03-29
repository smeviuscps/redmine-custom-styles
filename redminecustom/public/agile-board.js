/**
 * Custom javascript for redmine
 * Agil board
 */

/**
 * User settings
 */
$userSettings = {};
$localStorageModule = 'redminecustom';
if (localStorage.getItem($localStorageModule) !== null && localStorage.getItem($localStorageModule) !== 'null') {
    $userSettings = JSON.parse(localStorage.getItem($localStorageModule));
} else {
    $userSettings = {};
}
localStorage.setItem($localStorageModule, JSON.stringify($userSettings));

/**
 * Set user setting
 * @param $key
 * @param $value
 */
function setUserSetting($key, $value) {
    $userSettings[$key] = $value;
    localStorage.setItem($localStorageModule, JSON.stringify($userSettings));
}

/**
 * Get user setting by key
 * @param $key
 * @returns {*}
 */
function getUserSetting($key) {
    if (typeof $userSettings[$key] !== 'undefined') {
        return $userSettings[$key];
    }
    return null;
}

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
$projectInfoBox = $('<div id="project-info-box" class="open">')
    .append('<div class="project-info-box-head">')
    .append('<div class="project-info-box-content">');
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
$projectInfoBox.children('.project-info-box-content').append('<div class="project-info-module project-revolver"><h3>Revolver</h3></div>');
$projectInfoBox.find('.project-revolver').append('<ul>');
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
$projectInfoBox.children('.project-info-box-content').append($boxTasksUrgent);

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
$projectInfoBox.children('.project-info-box-content').append($boxTasksLaunches);

/**
 * Toggle project info box
 */
$(function() {
    var $textShow = 'Infobox einblenden',
        $textHide = 'Infobox ausblenden';
    $button = $('<button class="button toggle-project-info-box">' + $textHide + '</button>');
    $projectInfoBox = $('#project-info-box');
    $projectInfoBox.children('.project-info-box-head').prepend($button);
    if (getUserSetting('projectInfoBox') === 'hidden') {
        $projectInfoBox.removeClass('open');
        $('.toggle-project-info-box').text($textShow);
    }

    $('.toggle-project-info-box').on('click', function() {
        $trigger = $(this);
        if ($projectInfoBox.hasClass('open')) {
            $projectInfoBox.removeClass('open');
            $trigger.text($textShow);
            setUserSetting('projectInfoBox', 'hidden');
        } else {
            $projectInfoBox.addClass('open');
            $trigger.text($textHide);
            setUserSetting('projectInfoBox', '');
        }
    });
});



/**
 * Toggle swimlanes
 */
$(function() {
    $swimlanesSettings = getUserSetting('swimlanes');
    if ($swimlanesSettings == null) {
        $swimlanesSettings = {};
    }

    // Hide swimlanes which are configurated to be hidden
    $swimlanes = $('.swimlane.group');
    $swimlanes.each(function() {
        var $swimlane = $(this);
        if (typeof $swimlanesSettings[$swimlane.data('id')] !== 'undefined' && $swimlanesSettings[$swimlane.data('id')] === 'hidden') {
            $swimlane.removeClass('open');
            $swimlane.next('.swimlane.issue').css('display', 'none');
        }
    });
});

/**
 * Toggle full-width agile board
 */
$(function() {
    var $textShow = 'Sidebar einblenden',
        $textHide = 'Sidebar ausblenden';
    $fullWidthTrigger = $('<button class="button toggle-sidebar">' + $textHide + '</button>');
    $projectInfoBox = $('#project-info-box');
    $projectInfoBox.children('.project-info-box-head').prepend($fullWidthTrigger);

    if (getUserSetting('sidebar') === 'hidden') {
        $('#main').addClass('full-width');
        $('.toggle-sidebar').text($textShow);
    }

    $('.toggle-sidebar').on('click',function(){
        $trigger = $(this);
        $main = $('#main');
        if ($main.hasClass('full-width')) {
            $main.removeClass('full-width');
            $trigger.text($textHide);
            setUserSetting('sidebar', '');
        } else {
            $main.addClass('full-width');
            $trigger.text($textShow);
            setUserSetting('sidebar', 'hidden');
        }
    });
});

/**
 * Configure showing up of swimlanes
 */
$(function() {
    $projectInfoBox = $('#project-info-box');
    $swimlanes = $('.swimlane.group');
    $swimlanesModule = $('<div class="project-info-module project-swimlanes">')
        .append('<h3>Swimlanes</h3>')
        .append('<form>');

    $swimlanesSettings = getUserSetting('swimlanes');
    if ($swimlanesSettings == null) {
        $swimlanesSettings = {};
    }

    $swimlanes.each(function() {
        var $swimlane = $(this),
            $swimlaneTitle = $swimlane.find('.expander').siblings('a:first').text(),
            $checkbox = $('<div><label><input type="checkbox" name="swimlanes[]" value="' + $swimlane.data('id') + '"> ' + $swimlaneTitle + '</label></div>');
        if ((typeof $swimlanesSettings[$swimlane.data('id')] === 'undefined' && $swimlane.hasClass('open')) ||
            $swimlanesSettings[$swimlane.data('id')] === 'open') {
            $checkbox.find('input').prop('checked', true);
            $swimlanesSettings[$swimlane.data('id')] = 'open';
        } else {
            $swimlanesSettings[$swimlane.data('id')] = 'hidden';
        }
        $swimlanesModule.find('form').append($checkbox);
    });
    setUserSetting('swimlanes', $swimlanesSettings);

    $projectInfoBox.children('.project-info-box-content').append($swimlanesModule);

    $swimlanesModule.find(':checkbox').on('change', function() {
        var $checkbox = $(this),
            $swimlane = $('.swimlane.group[data-id="' + $checkbox.val() + '"]'),
            $swimlanesSettings = getUserSetting('swimlanes');

        if (($checkbox.is(':checked') && !$swimlane.hasClass('open')) ||
            (!$checkbox.is(':checked') && $swimlane.hasClass('open'))) {
            $swimlane.find('.expander').trigger('click');
            if ($swimlane.hasClass('open')) {
                $swimlanesSettings[$checkbox.val()] = 'open';
            } else {
                $swimlanesSettings[$checkbox.val()] = 'hidden';
            }
            setUserSetting('swimlanes', $swimlanesSettings);
        }
    });
});

/**
 *
 */
function updateAgileBoard() {
    $statusActive = $('table.issues-board:not(.sticky) thead th[data-column-id]');
    $swimlanes = $('.swimlane.group');
    $swimlanes.find('td[colspan]').attr('colspan', $statusActive.not('.hidden').length);
}

/**
 * Configure agile board
 */
$(function() {
    $projectInfoBox = $('#project-info-box');
    $boardStatusColumns = $('table.issues-board:not(.sticky) thead th[data-column-id]');
    $agileBoardModule = $('<div class="project-info-module project-agile-board">')
        .append('<h3>Agile Board</h3>')
        .append('<form>');

    // Settings
    $agileBoardSettings = getUserSetting('agile-board');
    if ($agileBoardSettings == null) {
        $agileBoardSettings = {};
        $agileBoardSettings['columns'] = {};
    }

    /**
     * Initiliaze current status
     */
    $boardStatusColumns.each(function() {
        var $statusColumn = $(this),
            $statusTitle = $statusColumn.text(),
            $statusColumnsHead = $('table.issues-board thead th[data-column-id="' + $statusColumn.data('column-id') + '"]'),
            $statusColumns = $('table.issues-board td[data-id="' + $statusColumn.data('column-id') + '"]'),
            $checkbox = $('<div><label><input type="checkbox" name="issue-status-columns[]" value="' + $statusColumn.data('column-id') + '"> ' + $statusTitle + '</label></div>');
        if ((typeof $agileBoardSettings['columns'][$statusColumn.data('column-id')] !== 'undefined' && $statusColumn.hasClass('hidden')) ||
            $agileBoardSettings['columns'][$statusColumn.data('column-id')] === 'hidden') {
            $checkbox.find('input').prop('checked', false);
            $statusColumnsHead.addClass('hidden');
            $statusColumns.addClass('hidden');
            $agileBoardSettings['columns'][$statusColumn.data('column-id')] = 'hidden';
        } else {
            $checkbox.find('input').prop('checked', true);
            $statusColumnsHead.removeClass('hidden');
            $statusColumns.removeClass('hidden');
            $agileBoardSettings['columns'][$statusColumn.data('column-id')] = 'open';
        }
        $agileBoardModule.find('form').append($checkbox);
    });
    setUserSetting('agile-board', $agileBoardSettings);

    // Update colspan of table rows
    updateAgileBoard();

    $projectInfoBox.children('.project-info-box-content').prepend($agileBoardModule);

    /**
     * Checkbox event
     */
    $agileBoardModule.find(':checkbox').on('change', function() {
        var $checkbox = $(this),
            $statusColumnsHead = $('table.issues-board thead th[data-column-id="' + $checkbox.val() + '"]'),
            $statusColumns = $('table.issues-board td[data-id="' + $checkbox.val() + '"]'),
            $agileBoardSettings = getUserSetting('agile-board');

        if (($checkbox.is(':checked') && $statusColumnsHead.hasClass('hidden')) ||
            (!$checkbox.is(':checked') && !$statusColumnsHead.hasClass('hidden'))) {
            if ($statusColumnsHead.hasClass('hidden')) {
                $statusColumnsHead.removeClass('hidden');
                $statusColumns.removeClass('hidden');
                $agileBoardSettings['columns'][$checkbox.val()] = 'open';
            } else {
                $statusColumnsHead.addClass('hidden');
                $statusColumns.addClass('hidden');
                $agileBoardSettings['columns'][$checkbox.val()] = 'hidden';
            }
            setUserSetting('agile-board', $agileBoardSettings);

            // Update colspan of table rows
            updateAgileBoard();
        }
    });
});

/**
 * Accordions
 */
$(function() {
    var $accordions = $('#project-info-box .project-info-module'),
        $accordionSettings = getUserSetting('accordions');

    if ($accordionSettings == null) {
        $accordionSettings = {};
    }

    // Add accordion markup
    $accordions.addClass('accordion').wrapInner('<div class="project-info-module-content"></div>');

    $accordions.each(function() {
        var $accordion = $(this),
            $accordionTrigger = $accordion.find('h3'),
            $accordionTitle = $accordionTrigger.text();
        $accordion.prepend($accordionTrigger);

        // Open accordion which is configurated to be open
        if ($accordionSettings[$accordionTitle] === 'open') {
            $accordion.addClass('open');
        }

        // Toggle accordion by click
        $accordionTrigger.on('click', function() {
            if ($accordion.hasClass('open')) {
                $accordion.removeClass('open');
                $accordionSettings[$accordionTitle] = 'hidden';
            } else {
                $accordion.addClass('open');
                $accordionSettings[$accordionTitle] = 'open';
            }
            setUserSetting('accordions', $accordionSettings);
        });
    });
});
