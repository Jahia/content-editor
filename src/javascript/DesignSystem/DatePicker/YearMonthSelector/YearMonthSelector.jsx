import * as React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const style = () => ({
    // TODO BACKLOG-14948
});

const YearMonthSelectorCmp = ({date, months, onChange}) => {
    const selectedMonth = date.getMonth();
    const selectedYear = date.getFullYear();

    const fromMonth = new Date(selectedYear - 50, 0);
    const toMonth = new Date(selectedYear + 50, 11);

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = e => {
        const {year, month} = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select name="month" value={selectedMonth} onChange={handleChange}>
                {months.map((month, i) => (
                    <option key={month} value={i}>
                        {month}
                    </option>
                ))}
            </select>
            <select name="year" value={selectedYear} onChange={handleChange}>
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </form>
    );
};

YearMonthSelectorCmp.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
};

export const YearMonthSelector = withStyles(style)(YearMonthSelectorCmp);

YearMonthSelector.displayName = 'YearMonthSelector';
