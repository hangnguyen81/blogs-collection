const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlog = [
    {
        title: 'Happy tummy – happy life',
        author: 'Hanna Kaijanaho',
        url: 'https://hang.kaijanaho.fi/?p=91',
        likes: 8, 
        summary: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo'
    },
    {
        title: 'Flower will cheer you up',
        author: 'Hang Nguyen',
        url: 'https://hang.kaijanaho.fi/?p=45',
        likes: 20,
        summary: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur'
    }
];

const blogInDb = async() =>{
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', author: 'unknown', url:'http://notexist' });
    await blog.save();
    await blog.remove();
  
    return blog._id.toString();
};

const usersInDb = async() =>{
    const users = await User.find({});
    return users.map(user => user.toJSON());
};

module.exports = {
    initialBlog, 
    blogInDb, 
    nonExistingId,
    usersInDb
};