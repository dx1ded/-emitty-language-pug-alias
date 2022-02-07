const lexer = require('pug-lexer')
const path = require('path')

function parse(aliases, filePath, buffer) {
  let data = buffer.toString()
  const arrayPath = filePath.split('\\')

  arrayPath.pop() // Remove file from path

  Object.entries(aliases).forEach((values) => {
    const [aliasName, aliasPath] = values

    data = data.replaceAll(aliasName, path.relative(
      arrayPath.join('\\'),
      aliasPath
    ))
  })
  
  const references = []
  const tokens = lexer(data)

  for (const token of tokens) {
    if (token.type === 'path') {
      const value = token.val.trim()
      
      references.push(value)
    }
  }

  return Promise.resolve({ references })
}

exports.parse = parse
