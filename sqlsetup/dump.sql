SET AUTOCOMMIT = 0;
START TRANSACTION;
--
-- Database: `freegames`
--
CREATE DATABASE IF NOT EXISTS `freegames` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `freegames`;

-- --------------------------------------------------------

--
-- Table structure for table `announced`
--

CREATE TABLE `announced` (
  `Name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `awaiting_approval`
--

CREATE TABLE `awaiting_approval` (
  `Name` text NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `Store` text NOT NULL,
  `Name` text NOT NULL,
  `TimeLeft` text NOT NULL DEFAULT 'Unknown',
  `Link` text NOT NULL,
  `Image` text NOT NULL,
  `State` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `supported_lang` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `prefix`
--

CREATE TABLE `prefix` (
  `GuildID` text NOT NULL,
  `prefix` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `servers`
--

CREATE TABLE `servers` (
  `GuildID` text NOT NULL,
  `ChannelID` text NOT NULL,
  `RoleID` text DEFAULT NULL,
  `language` text NOT NULL DEFAULT 'en_us',
  `config_everyone` tinyint(1) NOT NULL DEFAULT 0,
  `config_weekend` tinyint(1) NOT NULL DEFAULT 1,
  `config_epic` tinyint(1) NOT NULL DEFAULT 1,
  `config_steam` tinyint(1) NOT NULL DEFAULT 1,
  `config_uplay` tinyint(1) NOT NULL DEFAULT 1,
  `config_humble` tinyint(1) NOT NULL DEFAULT 1,
  `config_gog` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;