module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/mayofest-member-api',
      deployTo: '/var/www/mayofest-member-api',
      repositoryUrl: 'https://github.com/mdavidlawson/mayofest-member-api',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      key: '/home/dave/.ssh/id_rsa.pub',
      shallowClone: true
    },
    staging: {
      servers: 'dave@localhost'
    },
    production: {
      // TODO add pi info here
      servers: 'pi@192.168.0.101'
    }
  });
};
