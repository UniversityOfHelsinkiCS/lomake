module.exports = api => {
  api.cache(false)

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3.6,
      },
    ],
    '@babel/preset-react',
  ]

  return {
    presets,
  }
}
