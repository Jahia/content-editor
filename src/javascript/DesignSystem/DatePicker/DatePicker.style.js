export const style = theme => ({
    container: {
        display: 'flex',
        position: 'relative',
        backgroundColor: 'white',
        '& ul': {
            position: 'absolute',
            boxSizing: 'border-box',
            right: '0px'
        },
        '& .DayPicker': {
            borderRadius: '2px 0 0 2px',
            borderRight: 'none'
        }
    },
    containerDateTime: {
        paddingRight: '150px'
    },

    // DayPicker styling
    '@global': {
        '.DayPicker': {
            display: 'inline-block',
            fontSize: '1rem',
            border: `1px solid ${theme.palette.ui.omega}`,
            boxSizing: 'borderBox',
            boxShadow: '0px 1px 3px rgba(116, 116, 116, 0.2)',
            borderRadius: '2px'
        },

        '.DayPicker-wrapper': {
            position: 'relative',

            flexDirection: 'row',
            paddingBottom: '1em',

            userSelect: 'none'
        },

        '.DayPicker-wrapper:focus': {
            outline: 0
        },

        '.DayPicker-Months': {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
        },

        '.DayPicker-Month': {
            display: 'table',
            margin: '0 0.5em',
            marginTop: '1em',
            borderSpacing: '0',
            borderCollapse: 'collapse',

            userSelect: 'none'
        },

        '.DayPicker-NavBar': {},

        '.DayPicker-NavButton': {
            position: 'absolute',
            top: '1em',
            right: '1.5em',
            left: 'auto',

            display: 'inline-block',
            marginTop: '2px',
            width: '1.25em',
            height: '1.25em',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: '#8B9898',
            cursor: 'pointer',
            backgroundSize: '16px'
        },

        '.DayPicker-NavButton:hover': {
            opacity: '0.8'
        },

        '.DayPicker-NavButton--prev': {
            marginLeft: '20px',
            right: 'auto',
            backgroundImage:
                'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDA3OUI4IiBkPSJNMTEuNjcgMy44N0w5LjkgMi4xIDAgMTJsOS45IDkuOSAxLjc3LTEuNzdMMy41NCAxMnoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PC9zdmc+)'
        },
        '.DayPicker-NavButton--next': {
            left: '232px',
            backgroundImage:
                'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDA3OUI4IiBkPSJNNS44OCA0LjEyTDEzLjc2IDEybC03Ljg4IDcuODhMOCAyMmwxMC0xMEw4IDJ6Ii8+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIvPjwvc3ZnPg==)'
        },

        '.DayPicker-NavButton--interactionDisabled': {
            display: 'none'
        },

        '.DayPicker-Caption': {
            display: 'table-caption',
            marginBottom: '0.5em',
            padding: '0 0.5em',
            textAlign: 'center',
            color: theme.palette.brand.beta,
            ...theme.typography.delta
        },

        '.DayPicker-Caption > div': {
            fontWeight: '500',
            fontSize: '1.15em'
        },

        '.DayPicker-Weekdays': {
            display: 'table-header-group',
            marginTop: '1em',
            ...theme.typography.zeta,
            color: theme.palette.font.gamma
        },

        '.DayPicker-WeekdaysRow': {
            display: 'table-row',
            borderBottom: '1px solid #E0E6EA'
        },

        '.DayPicker-Weekday': {
            display: 'table-cell',
            padding: '0.5em',
            color: '#8B9898',
            textAlign: 'center',
            fontSize: '0.875em'
        },

        '.DayPicker-Weekday abbr[title]': {
            borderBottom: 'none',
            textDecoration: 'none'
        },

        '.DayPicker-Body': {
            display: 'table-row-group'
        },

        '.DayPicker-Week': {
            display: 'table-row'
        },

        '.DayPicker-Day': {
            display: 'table-cell',
            height: '36px',
            width: '36px',
            verticalAlign: 'middle',
            textAlign: 'center',
            cursor: 'pointer',
            ...theme.typography.iota,
            color: theme.palette.font.beta
        },

        '.DayPicker-WeekNumber': {
            display: 'table-cell',
            padding: '0.5em',
            minWidth: '1em',
            borderRight: '1px solid #EAECEC',
            color: '#8B9898',
            verticalAlign: 'middle',
            textAlign: 'right',
            fontSize: '0.75em',
            cursor: 'pointer'
        },

        '.DayPicker--interactionDisabled .DayPicker-Day': {
            cursor: 'default'
        },

        '.DayPicker-Footer': {
            paddingTop: '0.5em'
        },

        '.DayPicker-TodayButton': {
            border: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            color: '#4A90E2',
            fontSize: '0.875em',
            cursor: 'pointer'
        },

        /* Default modifiers */

        '.DayPicker-Day--today': {
            borderRadius: theme.spacing.unit / 2,
            backgroundColor: theme.palette.hover.beta
        },

        '.DayPicker-Day--outside': {
            color: '#8B9898',
            cursor: 'default'
        },

        '.DayPicker-Day--disabled': {
            color: '#DCE0E0',
            cursor: 'default'
        },

        /* Example modifiers */

        '.DayPicker-Day--sunday': {
            backgroundColor: '#F7F8F8'
        },

        '.DayPicker-Day--sunday:not(.DayPicker-Day--today)': {
            color: '#DCE0E0'
        },

        '.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
            position: 'relative',
            borderRadius: theme.spacing.unit / 2,
            backgroundColor: theme.palette.brand.beta,
            color: theme.palette.invert.beta
        },
        '.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):focus': {
            outline: 0
        },

        '.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover': {
            borderRadius: theme.spacing.unit / 2,
            backgroundColor: theme.palette.brand.beta
        },

        '.DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover': {
            borderRadius: theme.spacing.unit / 2,
            backgroundColor: theme.palette.hover.beta
        },

        /* DayPickerInput */

        '.DayPickerInput': {
            display: 'inline-block'
        },

        '.DayPickerInput-OverlayWrapper': {
            position: 'relative'
        },

        '.DayPickerInput-Overlay': {
            position: 'absolute',
            left: '0',
            zIndex: '1',

            background: 'white',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
        }
    }
});
