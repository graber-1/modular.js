/**
 * @file
 * Defines schema resolvers.
 */

import View from './connectors';

var resolvers = {
  Query: {
    author(root, args) {
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    },
    allAuthors() {
      return [{ id: 1, firstName: 'Hello', lastName: 'World' }];
    }
  },
  Author: {
    posts(author) {
      return [
        { id: 1, title: 'A post', text: 'Some text', views: 2 },
        { id: 2, title: 'Another post', text: 'Some other text', views: 200 }
      ];
    }
  },
  Post: {
    author(post) {
      return { id: 1, firstName: 'Tomas', lastName: 'Frank' };
    },
    views(post) {
      return View.findOne({ postId: post.id })
        .then(function (view) {
          if (!view) {
            console.log('empty (postId = ' + post.id + ')');
            return 0;
          }
          else {
            debugger;
            console.log('aaa');
            return view.views;
          }
        });
    },
  },
  Mutation: {
    setViews(root, args) {
      View.update({postId: args.postId}, {views: args.views}, function (err, raw) {
        if (err) {
          console.log(raw);
        }
      });
      return args.views;
    }
  }
}

export default resolvers;
