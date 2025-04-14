import React from "react";
// Reusable slider component for red, green, and blue inputs
export default function Slider(props) {
    const { min, max, onChange, startingValue } = props;

    const [value, setValue] = React.useState(startingValue);

    // handle changes for both number and slider inputs
    const handleChange = React.useCallback(event => {
        const value = parseInt(event.target.value);
        setValue(value);
        onChange(value);
    }, [onChange]);


    return <>
            <input type="number" min={min} max={max} value={value} onChange={handleChange} />
            <input type="range"  min={min} max={max} value={value} onChange={handleChange} />
        </>;
}