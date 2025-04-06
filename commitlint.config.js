module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 
      'refactor', 'test', 'chore', 'ci'
    ]],
    'subject-case': [0], // 不限制subject大小写
    'subject-max-length': [2, 'always', 72]
  }
}