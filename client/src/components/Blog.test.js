import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

const blog = {
  title: 'Test blog',
  author: 'Hanna Kaijanaho',
  url: 'https://hang.kaijanaho.fi',
  likes: 5,
  creator: {
    username: 'hang',
    name: 'Hang Nguyen',
    id: '61b279d318d81dc59acaea44'
  },
  id: '61e6ab8ce39db21bbcea74fc'
};

//checks that the component displaying a blog renders the blog's title and author,
//but does not render its url or number of likes by default
test('renders content check', () => {
  const component = render(
    <Blog blog={blog} />
  );
  const div = component.container.querySelector('.blog-details');
  expect(div).toHaveTextContent('Test blog');
  expect(component.container).toHaveTextContent('Hanna Kaijanaho');

  const blogUrl = component.getByText('https://hang.kaijanaho.fi');
  expect(blogUrl).not.toBeVisible();
  const blogLikes = component.container.querySelector('.likes');
  expect(blogLikes).not.toBeVisible();


});

//checks that the blog's url and number of likes are shown
//when the button controlling the shown details has been clicked.
test('Check url & likes are shown when button View is clicked', () => {
  const component = render(<Blog blog={blog} />);

  const buttonView = component.getByText('View');
  fireEvent.click(buttonView);

  const blogUrl = component.getByText('https://hang.kaijanaho.fi');
  expect(blogUrl).toBeVisible();
  const blogLikes = component.container.querySelector('.likes');
  expect(blogLikes).toBeVisible();
});

test('Check when the like button is clicked twice', () => {
  const mockHandler = jest.fn();
  const component = render(<Blog blog={blog} likeBlog={mockHandler}/>);

  const buttonLike = component.getByText('Like');
  fireEvent.click(buttonLike);
  expect(mockHandler.mock.calls.length).toBe(1);

});