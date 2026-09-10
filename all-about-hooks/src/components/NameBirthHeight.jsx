import useField from '../hooks/useField'

const NameBirthHeight = () => {
    const name = useField('text')
    const birth = useField('date')
    const height = useField('number')

    return (
        <div>
            <form>
                name:
                <input  {...name} />
                <br />
                birthdate:
                <input {...birth} />
                <br />
                height:
                <input {...height} />
            </form>
            <div>
                {name.value} {birth.value} {height.value}
            </div>
        </div>
    )
}

export default NameBirthHeight

    // Similiar example to using the spread function
    //
    // <Greeting firstName='Arto' lastName='Hellas' />
    //
    // const person = {
    //   firstName: 'Arto',
    //   lastName: 'Hellas'
    // }
    //
    // <Greeting {...person} />
    //
    //
    // BECAUSE, useField returns
    //
    // 
    // return {
    //     type,
    //     value,
    //     onChange
    // }
    //
    //
    // < input
    //   type = 'date'
    //   value = { born }
    //   onChange = {(event) => setBorn(event.target.value)}
    //   />
