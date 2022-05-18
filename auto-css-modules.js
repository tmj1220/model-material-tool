const t = require('@babel/types');
const { extname } = require('path');

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

function autCssModule() {
  return {
    visitor: {
      ImportDeclaration(path) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node;
        if (specifiers.length && CSS_EXT_NAMES.includes(extname(value))) {
          source.value = `${value}?modules`;
        }
      },

      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator(path) {
        const { node } = path;
        if (
          t.isAwaitExpression(node.init)
          && t.isCallExpression(node.init.argument)
          && t.isImport(node.init.argument.callee)
          && node.init.argument.arguments.length === 1
          && t.isStringLiteral(node.init.argument.arguments[0])
          && CSS_EXT_NAMES.includes(extname(node.init.argument.arguments[0].value))
        ) {
          node.init.argument.arguments[0].value = `${node.init.argument.arguments[0].value}?modules`;
        }
      },
    },
  };
}

module.exports = autCssModule
