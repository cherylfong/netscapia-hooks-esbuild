import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('event handler receives correct prop objects when new blog is created', async () => {

    const createBlog = vi.fn()

    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const inputTitle = screen.getByLabelText('title:')
    await user.type(inputTitle, 'testing title')

    const inputAuthor = screen.getByLabelText('author:')
    await user.type(inputAuthor, 'testing author')

    const inputUrl = screen.getByLabelText('url:')
    await user.type(inputUrl, 'testing url')

    const submitButton = screen.getByText('Save')
    await user.click(submitButton)
    // await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(createBlog.mock.calls).toHaveLength(1)
    // expect(createBlog).toHaveBeenCalledWith({
    //   title: 'testing title',
    //   author: 'testing author',
    //   url: 'http://testing url'
    // })


    // mock.calls[0] retrieves the first call.
    // [0] retrieves its first argument.
    // .title retrieves the submitted title.
    expect(createBlog.mock.calls[0][0].title).toBe('testing title')
    expect(createBlog.mock.calls[0][0].author).toBe('testing author')
    expect(createBlog.mock.calls[0][0].url).toBe('http://testing url')

  })

})