document.addEventListener('DOMContentLoaded', () => {
    const inputs = {
        minutes: document.getElementById('minutes'),
        hours: document.getElementById('hours'),
        dayOfMonth: document.getElementById('day-of-month'),
        month: document.getElementById('month'),
        dayOfWeek: document.getElementById('day-of-week'),
    };

    const cronExpressionOutput = document.getElementById('cron-expression');
    const descriptionList = document.getElementById('description-list');
    const copyButton = document.getElementById('copy-button');

    const descriptions = {
        minutes: (val) => `<strong>Minutes:</strong> ${parsePart(val, 'minute', { every: 'Every minute' })}`,
        hours: (val) => `<strong>Hours:</strong> ${parsePart(val, 'hour', { every: 'Every hour' })}`,
        dayOfMonth: (val) => `<strong>Day of Month:</strong> ${parsePart(val, 'day of the month', { every: 'Every day' })}`,
        month: (val) => `<strong>Month:</strong> ${parsePart(val, 'month', { every: 'Every month', names: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] })}`,
        dayOfWeek: (val) => `<strong>Day of Week:</strong> ${parsePart(val, 'day of the week', { every: 'Every day of the week', names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] })}`,
    };

    function parsePart(val, unit, opts) {
        if (val === '*') return opts.every;
        if (val.includes(',')) {
            const parts = val.split(',');
            const namedParts = opts.names ? parts.map(p => opts.names[p] || p) : parts;
            return `At ${unit}s ${namedParts.join(' and ')}`;
        }
        if (val.includes('/')) {
            const [, step] = val.split('/');
            return `Every ${step} ${unit}s`;
        }
        if (val.includes('-')) {
            const [start, end] = val.split('-');
            const startName = opts.names ? (opts.names[start] || start) : start;
            const endName = opts.names ? (opts.names[end] || end) : end;
            return `From ${unit} ${startName} through ${endName}`;
        }
        if (val === 'L' && unit === 'day of the month') return 'On the last day of the month';

        const namedVal = opts.names ? (opts.names[val] || val) : val;
        return `At ${unit} ${namedVal}`;
    }

    function updateCron() {
        const cronParts = {
            minutes: inputs.minutes.value || '*',
            hours: inputs.hours.value || '*',
            dayOfMonth: inputs.dayOfMonth.value || '*',
            month: inputs.month.value || '*',
            dayOfWeek: inputs.dayOfWeek.value || '*',
        };

        const expression = Object.values(cronParts).join(' ');
        cronExpressionOutput.textContent = expression;

        descriptionList.querySelector('[data-part="minutes"]').innerHTML = descriptions.minutes(cronParts.minutes);
        descriptionList.querySelector('[data-part="hours"]').innerHTML = descriptions.hours(cronParts.hours);
        descriptionList.querySelector('[data-part="day-of-month"]').innerHTML = descriptions.dayOfMonth(cronParts.dayOfMonth);
        descriptionList.querySelector('[data-part="month"]').innerHTML = descriptions.month(cronParts.month);
        descriptionList.querySelector('[data-part="day-of-week"]').innerHTML = descriptions.dayOfWeek(cronParts.dayOfWeek);
    }

    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updateCron);
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(cronExpressionOutput.textContent).then(() => {
            const icon = copyButton.querySelector('i');
            icon.classList.remove('far', 'fa-copy');
            icon.classList.add('fas', 'fa-check');
            copyButton.title = "Copied!";
            setTimeout(() => {
                icon.classList.remove('fas', 'fa-check');
                icon.classList.add('far', 'fa-copy');
                copyButton.title = "Copy to clipboard";
            }, 2000);
        });
    });

    // Initial update
    updateCron();
});