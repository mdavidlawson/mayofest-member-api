-- For storing sessions
DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(10) NOT NULL,
  `member_id` int(11) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
