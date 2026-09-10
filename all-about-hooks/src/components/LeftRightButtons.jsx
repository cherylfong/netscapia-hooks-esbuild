import useCounter from '../hooks/useCounter'

const LeftRightButtons = () => {

    const left = useCounter()
    const right = useCounter()

    return (
        <div>
            {left.value}
            <button onClick={left.increase}>
                left
            </button>
            <button onClick={right.increase}>
                right
            </button>
            {right.value}
        </div>
    )
}

export default LeftRightButtons