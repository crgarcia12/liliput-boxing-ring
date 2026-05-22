module.exports = {
  default: {
    require: ['tests/features/step_definitions/**/*.js', 'tests/features/support/**/*.js'],
    format: ['progress', 'json:tests/cucumber-report.json'],
    publishQuiet: true
  }
};
