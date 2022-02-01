describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset/users');
    cy.request('POST', 'http://localhost:3003/api/testing/reset/blogs');
    const users = [
      {
        name: 'Hang Nguyen',
        username: 'hang',
        password: '12345'
      },
      {
        name: 'Leo Minh',
        username: 'leo',
        password: '54321'
      }
    ];
    for (let user of users)
      cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('front page can be opened', function() {
    cy.contains('Bloglist');
    cy.contains('Copyright © Hang Nguyen - Bloglist exercise - Full Stack Open course 2021');
  });

  it('login form can be opened', function() {
    cy.contains('login').click();
  });

  describe('Login', function(){
    it('Login with correct credentials', function() {
      cy.contains('login').click();
      cy.get('#username').type('hang');
      cy.get('#password').type('12345');
      cy.get('#login-button').click();
      cy.contains('Hang Nguyen logged in');
    });

    it('Login fail with wrong password', function() {
      cy.contains('login').click();
      cy.get('#username').type('hang');
      cy.get('#password').type('wrong-pass');
      cy.get('#login-button').click();
      cy.get('.error')
        .should('contain','Invalid username or password')
        .should('have.css','color','rgb(255, 0, 0)')
        .should('have.css','border-style','solid');
      cy.get('html').should('not.contain','Hang Nguyen logged in');
    });
  });
});

describe('When logged in:', function() {
  beforeEach(function() {
    cy.login({ username: 'hang', password: '12345' });
  });

  it('A new blog can created', function() {
    cy.contains('Add a new blog').click();
    cy.get('#title').type('Tested by Cypress');
    cy.get('#author').type('Cypress');
    cy.get('#url').type('http://cypress.test');
    cy.get('#likes').type(3);
    cy.get('#summary').type('Summary of test blog - tested by Cypress');
    cy.get('#createBlog-button').click();
  });

  describe('when a list of blogs are existed', function(){
    beforeEach(function(){
      cy.request('POST', 'http://localhost:3003/api/testing/reset/blogs');
      const blogs = [
        {
          title: 'Blog 1',
          author: 'Cypress',
          url: 'http://cypress.io',
          likes: 1,
          summary: 'Summary of test blog 1 - tested by Cypress'
        },
        {
          title: 'Blog 2',
          author: 'Cypress',
          url: 'http://cypress.io',
          likes: 5,
          summary: 'Summary of test blog 2 - tested by Cypress'
        },
        {
          title: 'Blog 3',
          author: 'Cypress',
          url: 'http://cypress.io',
          likes: 4,
          summary: 'Summary of test blog 3 - tested by Cypress'
        },
      ];
      for (let blog of blogs){
        cy.createBlog(blog);
      }
    });

    it('User can like a blog', function(){
      cy.contains('Blog 1').parent().contains('View').as('viewButton');
      cy.get('@viewButton').click();

      cy.contains('Blog 1').parent().contains('Like').as('likeButton');
      cy.get('@likeButton').click();

      cy.contains('Favourite: 2 likes');
    });

    it('User who created a blog can delete it', function(){
      cy.contains('Blog 1').parent().contains('View').as('viewButton');
      cy.get('@viewButton').click();

      cy.contains('Blog 1').parent().contains('Remove').as('removeButton');
      cy.get('@removeButton').click();

      cy.get('#title').should('not.contain','Blog 1');
    });

  });
});