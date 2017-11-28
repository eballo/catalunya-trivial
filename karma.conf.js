module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'index.html',
      'test/quiz.spec.js'
    ],
    browsers: ['Chrome'],
    port: 9876,
    singleRun: true
  })
};
