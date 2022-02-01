import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

test('<BlogForm /> calls the event handler if received the right input when a new blog is created', () => {
  const createBlog = jest.fn();
  const component = render(<BlogForm createBlog={createBlog}/>);

  const title = component.container.querySelector('#title');
  fireEvent.change(title, {
    target: { value: 'Test blog' }
  });
  expect(title.value).toEqual('Test blog');

  const author = component.container.querySelector('#author');
  fireEvent.change(author, {
    target: { value: 'Hanna Kaijanaho' }
  });
  expect(author.value).toEqual('Hanna Kaijanaho');

  const url = component.container.querySelector('#url');
  fireEvent.change(url, {
    target: { value: 'https://hang.kaijanaho.fi' }
  });
  expect(url.value).toEqual('https://hang.kaijanaho.fi');

  const likes = component.container.querySelector('#likes');
  fireEvent.change(likes, {
    target: { value: 5 }
  });
  expect(likes.value).toBe('5');

  const summary = component.container.querySelector('#summary');
  fireEvent.change(summary, {
    target: { value: 'test BlogForm input' }
  });
  expect(summary.value).toEqual('test BlogForm input');

  const form = component.container.querySelector('form');
  fireEvent.submit(form);
  expect(createBlog.mock.calls).toHaveLength(1);
});
