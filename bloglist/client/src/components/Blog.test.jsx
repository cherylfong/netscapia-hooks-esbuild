// From the project's root directory .i.e. bloglist-frontend,
// execute this command to initiate the vitest
// npm test src/components/Blog.test.jsx

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)


describe('<Blog />', () => {


  test('displays blog title and author but does not show URL and number of Likes as details are not expanded', () => {

    const blogItem = {
      title: 'some title',
      author: 'some author',
      url: 'some url',
      likes: 1
    }


    const mockUpdateBlogLikesHandler = vi.fn()
    const mockRemoveBlogHandler = vi.fn()

    const { container } = renderWithRouter(<Blog blog={blogItem}
      loggedInUser={'dummy'}
      updateBlogLikes={mockUpdateBlogLikesHandler}
      removeBlog={mockRemoveBlogHandler}
      counter={0} />)


    const titleByAuthor = container.querySelector('#title-author-test-0')
    expect(titleByAuthor).toHaveTextContent('some title by some author')

    const urlNotVisible = screen.getByText('some url')
    expect(urlNotVisible).not.toBeVisible()

    const likesNotVisible = screen.getByText('1 like')
    expect(likesNotVisible).not.toBeVisible()

  })

  test('blog url and likes shown when view button toggled', async () => {

    const blogItem = {
      title: 'some title',
      author: 'some author',
      url: 'some url',
      likes: 1
    }

    const mockUpdateBlogLikesHandler = vi.fn()
    const mockRemoveBlogHandler = vi.fn()

    renderWithRouter(<Blog blog={blogItem}
      loggedInUser={'dummy'}
      updateBlogLikes={mockUpdateBlogLikesHandler}
      removeBlog={mockRemoveBlogHandler}
      counter={0}
      startCollapsed={true} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlVisible = screen.getByText('some url')
    expect(urlVisible).toBeVisible()

    const likesVisible = screen.getByText('1 like')
    expect(likesVisible).toBeVisible()

  })

  test('Only Like button shown to unauthenticated user | DETAILS: blog author, title, url, and likes are displayed  with the like button to unauthenticated user but no delete button', async () => {

    const blogItem = {
      title: 'some title',
      author: 'some author',
      url: 'some url',
      likes: 1
    }


    const mockUpdateBlogLikesHandler = vi.fn()
    const mockRemoveBlogHandler = vi.fn()

    const { container } = renderWithRouter(<Blog blog={blogItem}
      loggedInUser={''}
      updateBlogLikes={mockUpdateBlogLikesHandler}
      removeBlog={mockRemoveBlogHandler}
      counter={0} />)

    const titleByAuthor = container.querySelector('#title-author-test-0')
    expect(titleByAuthor).toHaveTextContent('some title by some author')

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlVisible = screen.getByText('some url')
    expect(urlVisible).toBeVisible()

    const likesVisible = screen.getByText('1 like')
    expect(likesVisible).toBeVisible()

    const likeButton = screen.getByText('👍')

    const deleteButton = screen.getByText('DELETE')

    expect(likeButton).toBeVisible()

    expect(deleteButton).not.toBeVisible()
  })


  test('Only Like button shown to authenticated user | DETAILS: blog author, title, url, and likes are displayed with the like button to authenticated user but no delete button because they are not the blog creator', async () => {

    const blogItem = {
      title: 'some title',
      author: 'some author',
      url: 'some url',
      likes: 1,
      user:{
        username: 'notdummy'
      }
    }


    const mockUpdateBlogLikesHandler = vi.fn()
    const mockRemoveBlogHandler = vi.fn()

    const { container } = renderWithRouter(<Blog blog={blogItem}
      loggedInUser={'dummy'}
      updateBlogLikes={mockUpdateBlogLikesHandler}
      removeBlog={mockRemoveBlogHandler}
      counter={0} />)

    const titleByAuthor = container.querySelector('#title-author-test-0')
    expect(titleByAuthor).toHaveTextContent('some title by some author')

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlVisible = screen.getByText('some url')
    expect(urlVisible).toBeVisible()

    const likesVisible = screen.getByText('1 like')
    expect(likesVisible).toBeVisible()

    const likeButton = screen.getByText('👍')

    const deleteButton = screen.getByText('DELETE')

    expect(likeButton).toBeVisible()

    expect(deleteButton).not.toBeVisible()

  })


   test('blog creator shown delete button | DETAILS: blog author, title, url, and likes are displayed with the like button AND DELETE button because they are the authenticated blog creator', async () => {

    const blogItem = {
      title: 'some title',
      author: 'some author',
      url: 'some url',
      likes: 1,
      user:{
        username: 'dummy'
      }
    }


    const mockUpdateBlogLikesHandler = vi.fn()
    const mockRemoveBlogHandler = vi.fn()

    const { container } = renderWithRouter(<Blog blog={blogItem}
      loggedInUser={'dummy'}
      updateBlogLikes={mockUpdateBlogLikesHandler}
      removeBlog={mockRemoveBlogHandler}
      counter={0} />)

    const titleByAuthor = container.querySelector('#title-author-test-0')
    expect(titleByAuthor).toHaveTextContent('some title by some author')

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlVisible = screen.getByText('some url')
    expect(urlVisible).toBeVisible()

    const likesVisible = screen.getByText('1 like')
    expect(likesVisible).toBeVisible()

    const likeButton = screen.getByText('👍')

    const deleteButton = screen.getByText('DELETE')

    // screen.debug()

    expect(likeButton).toBeVisible()

    expect(deleteButton).toBeVisible()

  })

}) // end: describe