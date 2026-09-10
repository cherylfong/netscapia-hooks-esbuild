import useLocalStorage from '../hooks/useLocalStorage'

const LocalStorage = () => {

    const [value, setValue] = useLocalStorage('value', '')

    const style = {
        fontSize : 'x-small'
    }

    return (
        <div>
            <input value={value} onChange={e => setValue(e.target.value)} />
            <p>The key: "<i>value</i>" has the value: "{value}" and is stored in the browser's <i>LocalStorage.</i></p>
            <p style={style}>Right-click this page, select <i>Inspect</i>, then find the <i>Storage</i> tab and then select the drop-down "Local Storage". You will see <b>Key</b>: value and <b>Value</b>: {value}</p>
        </div>
    )
}

export default LocalStorage