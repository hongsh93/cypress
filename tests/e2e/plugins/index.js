/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

require('dotenv').config()

module.exports = (on, config) => {
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))
  // config.baseUrl = 'https://perf-columbus.netmarble.com/dashboard/'
  config.baseUrl = 'http://localhost:8081/dashboard/'

  const file = config.env.fileConfig || 'development';
  if (file == "local") {
    config.string_label = "string_1"
    config.number_label = "isaac_number_test"
    config.timestamp_label = ""
    config.none_label = "abnormal_by_nid"
    config.json_string_label = ""
    config.json_number_label = ""
    config.json_timestamp_label = ""
  }
  else if (file == "perf") {
    config.string_label = "test_zone_label"
    config.number_label = "elapsed_day_after_last_login_by_pid"
    config.timestamp_label = "last_ads_view_datetime"
    config.none_label = "abnormal_by_nid"
    config.json_string_label = "guild_forum_member_by_game"
    config.json_number_label = "marbleone_ticket_count_by_game"
    config.json_timestamp_label = "last_login_by_game"
  }

  return Object.assign({}, config, {
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.js'
  })
}
