import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogView from './BlogView'

const blog = {
  id: '1',
  title: 'Component testing is done with RTL',
  author: 'Dax',
  url: 'https://reactjs.org',
  likes: 5,
  user: {id: '100', username: 'creator', name: 'Creator name'}
}

const renderWithRouter = (ui) => {
  return render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <Routes>
        <Route path="/blogs/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  )
}

// Test if Blog information and the number are displayed to unauthenticated users, buttons are not displayed
test('blog info and likes are displayed, no buttons, when logged out', () => {
  renderWithRouter(
    <BlogView blogs={[blog]} handleLike={() => {}} handleDelete={() => {}} user={null} />
  )

  expect(screen.getByText('Dax: Component testing is done with RTL')).toBeInTheDocument()
  expect(screen.getByText('likes', { exact: false })).toBeInTheDocument()

  expect(screen.queryByText('like')).not.toBeInTheDocument()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

// Authentiticated users who are not the blog's creator are shown only the like button
test('only the like button is shown to non-creator user', () => {
  const otherUser = { username: 'someone', name: 'Someone Else'}

  renderWithRouter(
    <BlogView blogs={[blog]} handleLike={() => {}} handleDelete={() => {}} user={otherUser} />
  )

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

// The Blog's creator is also shown the delete button
test('the delete button is only shown to the blog creator', () => {
  const creator = { username: 'creator', name: 'Creator Name'}

  renderWithRouter(
    <BlogView blogs={[blog]} handleLike={() => {}} handleDelete={() => {}} user={creator} />
  )

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.queryByText('remove')).toBeInTheDocument()
})

