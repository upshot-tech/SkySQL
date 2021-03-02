DROP PROCEDURE generate_data;

DELIMITER $$
CREATE PROCEDURE generate_data()
BEGIN
  DECLARE i INT DEFAULT 0;
  WHILE i < 1000 DO
    INSERT INTO `skysql` (`c1`,`c2`,`c3`) VALUES (
      ROUND(RAND()*100000000,2),
      'asd',
      FROM_UNIXTIME(UNIX_TIMESTAMP('2010-01-01 01:00:00')+FLOOR(RAND()*315360000))
    );
    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;

CALL generate_data();


UPDATE skysql SET c2=substring(MD5(UUID()), FLOOR(RAND()*10+1));