'use strict';

const path = require('path');
const util = require('./util');

exports.rule = {
  meta: {
    docs: {
      description: 'require that enums appear in dedicated modules (unless private)'
    }
  },

  create: function(context) {
    const sourceRoot = path.join(process.cwd(), 'src');

    return {
      AssignmentExpression: function(expression) {
        const comments = expression.parent.leadingComments;
        if (comments && expression.left.type === 'MemberExpression') {
          const comment = comments[comments.length - 1];
          if (comment.value.indexOf('* @enum {') >= 0 && comment.value.indexOf('* @private') === -1) {
            const filePath = context.getFilename();
            const requirePath = path.relative(sourceRoot, filePath);
            const name = util.getName(expression.left);
            const expectedPath = name.split('.').join(path.sep).toLowerCase() + '.js';
            if (requirePath.toLowerCase() !== expectedPath) {
              context.report(expression, `Expected enum to be in a module named like the enum ('${expectedPath}')`);
            }
          }
        }
      }
    };
  }
};
