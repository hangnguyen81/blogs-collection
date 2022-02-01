const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');

const api = supertest(app);
let token;

beforeEach(async() =>{
    //initial setup for blog
    await Blog.deleteMany({});
    await Blog.insertMany({});

    //initial setup for user
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('bimat',10);
    const user = new User({username: 'root', passwordHash});
    await user.save();
    // initial setup for token
    const userForToken = {
        username: user.username,
        id: user._id,
    };
    // eslint-disable-next-line no-undef
    token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60*60});
},10000);

test('Blog is return as JSON', async() =>{
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('All blogs return', async () => {
    const response = await api.get('/api/blogs');  
    expect(response.body).toHaveLength(helper.initialBlog.length);
});

test('Verify id of blog', async()=>{
    const blogsAtStart = await helper.blogInDb();
    blogsAtStart.map(blog =>{
        expect(blog.id).toBeDefined();
    });
});


test('Valid blog can be added', async()=>{
    const newBlog = {
        title: 'Finnish Spring',
        author: 'Hang Kaijanaho',
        url: 'https://hang.kaijanaho.fi/?p=117',
        likes: 10,
        summary:'Testing blog ahihi'
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogAtEnd = await helper.blogInDb();
    expect(blogAtEnd).toHaveLength(helper.initialBlog.length + 1);

    const titles = blogAtEnd.map(item => item.title);
    expect(titles).toContain('Finnish Spring');
});

test('blog likes is missing, save 0 to database', async()=>{
    const newBlog = {
        title: 'Blog without likes',
        author: 'Leo Minh',
        url:'https://hang.kaijanaho.fi/?p=117'
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1);

    const blogsLikes = blogsAtEnd.map(item => item.likes);
    expect(blogsLikes).toContain(0);

});

test('Blog without title, url cannot added to database',async()=>{
    const newBlog = {
        author: 'Hang Kaijanaho',
        likes: 10
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400);
    
    const blogAtEnd = await helper.blogInDb();
    expect(blogAtEnd).toHaveLength(helper.initialBlog.length);
});


test('a specific blog can be viewed', async()=>{
    const blogsAtStart  = await helper.blogInDb();
    const blogToView = blogsAtStart[0];
    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(resultBlog.body).toEqual(blogToView);   
});

test('a specific blog can be deleted', async() =>{
    const blogsAtStart = await helper.blogInDb();
    const blogToDelete = blogsAtStart[0];
    
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);
    
    const blogsAtEnd = await helper.blogInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map(item => item.title);
    expect(titles).not.toContain(blogToDelete.title);
});

test('update a specific blog', async()=>{
    const blogsAtStart = await helper.blogInDb();
    const blogToUpdate = blogsAtStart[0];
    
    const updateBlog = {
        title: 'Happy life',
        author: 'Hanna Kaijanaho',
        url: 'https://hang.kaijanaho.fi/?p=91',
        likes: 10
    };

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateBlog)
        .expect(200);
    
    const blogsAtEnd = await helper.blogInDb();
    const updatedBlog = blogsAtEnd.find(blog => blog.id ===blogToUpdate.id);
    expect(updatedBlog.title).toBe('Happy life');
    expect(updatedBlog.likes).toBe(10);
});


// test case for USER
describe('Creating new user', () =>{
    test('Adding valid user', async()=>{
        const usersAtStart = await helper.usersInDb();
    
        const newUser = {
            username: 'hang.nguyen',
            name: 'Hang Nguyen',
            password: 'hanna'
        };
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length+1);
    
        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('Adding invalid user - name is existed', async()=>{
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username:'root',
            name:'superroot',
            password: 'hanna'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('Adding invalid user - no username or password', async()=>{
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            name: 'Leo Minh'
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(() =>{
    mongoose.connection.close();
});