const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  } if (blogs.length === 1) {
    return blogs[0].likes;
  }
  return blogs.reduce((a, b) => a + b.likes, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 'No blog';
  }
  const likesArray = blogs.map((blog) => {
    const arr = [];
    return arr.concat(blog.likes);
  });

  const highestLikes = Math.max(...likesArray);

  const { title, author, likes } = blogs.find(
    (blog) => blog.likes === highestLikes,
  );

  return { title, author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
