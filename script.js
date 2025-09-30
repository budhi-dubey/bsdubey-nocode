document.addEventListener('DOMContentLoaded', () => {
    const inputs = {
        minutes: document.getElementById('minutes'),
        hours: document.getElementById('hours'),
        'day-of-month': document.getElementById('day-of-month'),
        month: document.getElementById('month'),
        'day-of-week': document.getElementById('day-of-week'),
    };

    const cronExpressionOutput = document.getElementById('cron-expression');
    const cronDescriptionOutput = document.getElementById('cron-description');
    const copyButton = document.getElementById('copy-button');

    function updateCronExpression() {
        const cronParts = [
            inputs.minutes.value || '*',
            inputs.hours.value || '*',
            inputs['day-of-month'].value || '*',
            inputs.month.value || '*',
            inputs['day-of-week'].value || '*',
        ];
        const cronExpression = cronParts.join(' ');
        cronExpressionOutput.textContent = cronExpression;
        cronDescriptionOutput.textContent = getCronDescription(cronParts);
    }

    // Add event listeners to text inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updateCronExpression);
    });

    // Add event listeners to option buttons
    document.querySelectorAll('.button-options button').forEach(button => {
        button.addEventListener('click', () => {
            const inputGroup = button.closest('.input-group');
            const input = inputGroup.querySelector('input[type="text"]');
            input.value = button.dataset.value;
            updateCronExpression();
        });
    });

    // Copy button functionality
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(cronExpressionOutput.textContent).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
        });
    });

    // Function to generate human-readable description
    function getCronDescription(parts) {
        const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

        if (parts.every(p => p === '*')) return 'Every minute of every day.';

        let description = 'At ';

        // Time part
        if (minute === '*' && hour === '*') description += 'every minute of every hour';
        else if (minute === '0' && hour === '*') description += 'the start of every hour';
        else if (minute !== '*' && hour === '*') description += `minute ${minute} past every hour`;
        else if (minute === '*' && hour !== '*') description += `every minute during hour ${hour}`;
        else description += `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

        // Date part
        let datePart = '';
        if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
            datePart = ' on every day';
        } else {
            if (dayOfWeek !== '*' && dayOfWeek !== '?') {
                 datePart += ` on ${describeDayOfWeek(dayOfWeek)}`;
            }

            if (dayOfMonth !== '*' && dayOfMonth !== '?') {
                if(dayOfWeek !== '*' && dayOfWeek !== '?') datePart += ' and';
                datePart += ` on day-of-month ${describeDayOfMonth(dayOfMonth)}`;
            }

            if (month !== '*') {
                 datePart += ` in ${describeMonth(month)}`;
            }
        }

        return (description + datePart).trim() + '.';
    }

    function describeDayOfWeek(val) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (val === '1-5') return 'Monday through Friday';
        if (val === '0,6') return 'Saturday and Sunday';
        return val.split(',').map(d => days[parseInt(d)] || `day ${d}`).join(', ');
    }

    function describeDayOfMonth(val) {
        if (val === 'L') return 'the last day of the month';
        return val;
    }

    function describeMonth(val) {
        const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if(val.includes(',')) return val.split(',').map(m => months[parseInt(m)] || `month ${m}`).join(', ');
        return months[parseInt(val)] || `month ${val}`;
    }


    // Initial call to set the values
    updateCronExpression();
});