document.addEventListener('DOMContentLoaded', () => {
    const minutesInput = document.getElementById('minutes');
    const hoursInput = document.getElementById('hours');
    const dayOfMonthInput = document.getElementById('day-of-month');
    const monthInput = document.getElementById('month');
    const dayOfWeekInput = document.getElementById('day-of-week');
    const cronExpressionOutput = document.getElementById('cron-expression');
    const cronDescriptionOutput = document.getElementById('cron-description');

    const inputs = [minutesInput, hoursInput, dayOfMonthInput, monthInput, dayOfWeekInput];

    function updateCronExpression() {
        const cronParts = inputs.map(input => input.value || '*');
        const cronExpression = cronParts.join(' ');
        cronExpressionOutput.textContent = cronExpression;
        updateCronDescription(cronParts);
    }

    function updateCronDescription(parts) {
        const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;
        let description = '';

        // This is a simplified description logic.
        // A more robust solution would require a proper cron parsing library.

        description += `Runs at minute ${minutes}, `;
        description += `hour ${hours}, `;
        description += `on day-of-month ${dayOfMonth}, `;
        description += `in month ${month}, `;
        description += `on day-of-week ${dayOfWeek}.`;

        if (minutes === '*' && hours === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            description = 'Every minute.';
        } else if (minutes !== '*' && hours === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            description = `Every hour at minute ${minutes}.`;
        } else if (minutes !== '*' && hours !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            description = `Every day at ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}.`;
        }


        cronDescriptionOutput.textContent = prettifyDescription(parts);
    }

    function prettifyDescription(parts) {
        const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

        if (parts.every(p => p === '*')) {
            return 'Every minute of every day.';
        }

        let time = '';
        if (hour === '*' && minute === '*') {
            time = 'every minute';
        } else if (hour === '*') {
            time = `at minute ${minute}`;
        } else if (minute === '*') {
            time = `every minute past hour ${hour}`;
        } else {
            time = `at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }

        let date = '';
        if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            date = 'every day';
        } else {
            const dayOfMonthPart = dayOfMonth === '*' ? '' : `on day-of-month ${dayOfMonth}`;
            const monthPart = month === '*' ? '' : `in ${getMonthName(month)}`;
            const dayOfWeekPart = dayOfWeek === '*' ? '' : `on ${getDayName(dayOfWeek)}`;

            const dateParts = [dayOfMonthPart, monthPart, dayOfWeekPart].filter(Boolean);
            if (dateParts.length > 0) {
                date = dateParts.join(', ');
            }
        }

        return `At ${time}, ${date}.`;
    }

    function getMonthName(month) {
        const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (month >= 1 && month <= 12) {
            return names[month - 1];
        }
        return `month ${month}`;
    }

    function getDayName(day) {
        const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (day >= 0 && day <= 6) {
            return names[day];
        }
        return `day ${day}`;
    }


    inputs.forEach(input => {
        input.addEventListener('input', updateCronExpression);
    });

    // Initial call
    updateCronExpression();
});