import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

// Render test
test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with RTL',
    author: 'Kent C. Dodds',
    url: 'https://reactjs.org',
    likes: 5,
    user: { name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Component testing is done with RTL', { exact: false })).toBeVisible()
  expect(screen.getByText('Kent C. Dodds', { exact: false })).toBeVisible()

  expect(screen.getByText('https://reactjs.org')).not.toBeVisible()
  expect(screen.getByText('likes', { exact: false })).not.toBeVisible()
})

// Click test
test('url and likes are shown when the view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with RTL',
    author: 'Kent C. Dodds',
    url: 'https://reactjs.org',
    likes: 5,
    user: { name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByText('https://reactjs.org')).toBeVisible()
  expect(screen.getByText('likes', { exact: false })).toBeVisible()
})

// Togglable test
describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container
  })

  test('renders its children', () => {
    expect(screen.getByText('togglable content')).toBeInTheDocument()
  })

  test('at start, children are not displayed', () => {
    const div = container.querySelector('.testDiv')
    expect(div).not.toBeVisible()
  })

  test('children are displayed after clicking the show button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.testDiv')
    expect(div).toBeVisible()
  })
})

// Like test
test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with RTL',
    author: 'Kent C. Dodds',
    url: 'https://reactjs.org',
    likes: 5,
    user: { name: 'Test User' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

// BlogForm test
test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testing Forms in React')
  await user.type(authorInput, 'Dax')
  await user.type(urlInput, 'https://example.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Forms in React')
  expect(createBlog.mock.calls[0][0].author).toBe('Dax')
  expect(createBlog.mock.calls[0][0].url).toBe('https://example.com')
})