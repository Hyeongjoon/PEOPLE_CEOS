DROP DATABASE IF exists people;
CREATE DATABASE people DEFAULT CHARACTER SET utf8;



use people;

SET foreign_key_checks = 0;

	DROP TABLE IF exists user;
create table user
		(uid int unsigned NOT NULL AUTO_INCREMENT,
         id VARCHAR(50) NOT NULL,
         email VARCHAR(50) NOT NULL,
         password VARCHAR (255) NOT NULL,
         pwd_update_date datetime default now(),
         phone_number VARCHAR (15) NOT NULL,
         phone_verify boolean default false NOT NULL,
         email_verify boolean default false NOT NULL,
         gender tinyint not null,  /** 0 male 1 female **/
         name VARCHAR(20) NOT NULL,
         birth_date date NOT NULL,
         primary key(uid),
         unique(id),
         unique(email),
         unique(phone_number)
) Engine =InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists admin;
create table admin(
	aid tinyint unsigned NOT NULL AUTO_INCREMENT,
    id varchar(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nick VARCHAR(20) NOT NULL,
    name VARCHAR(10),
    primary key(aid)
)  Engine =InnoDB DEFAULT CHARSET = utf8;
	
    
    DROP TABLE IF exists fr_list;
create table fr_list
	( main_uid int unsigned,
      target_uid int unsigned,
	primary key(main_uid , target_uid),
    foreign key(main_uid) references user(uid) ON DELETE cascade on update cascade,
    foreign key(target_uid) references user(uid) ON DELETE cascade on update cascade
) Engine =InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists hs_table; /**병원테이블**/
create table hs_table(
	hsid int unsigned AUTO_INCREMENT,
    hs_name VARCHAR(50),
    hs_num VARCHAR(50),
    primary key(hsid)
)  Engine =InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists origin_table;
create table origin_table(
	oid int unsigned AUTO_INCREMENT,
    origin_name VARCHAR(50),
    origin_num VARCHAR(50),
    primary key(oid)
) Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists bdc_req_table;
create table bdc_req_table(
	brt_id int unsigned NOT NULL AUTO_INCREMENT,
    aim_num tinyint unsigned NOT NULL,
    current_num tinyint unsigned default 0 NOT NULL,
    reg_date datetime default now(),
    end_date date default null,
	target_date date NOT NULL,
    sur_content VARCHAR(255) NOT NULL,
    writer int unsigned,
    content text default NULL,
    finish boolean default false,
    confirm boolean default false,
    primary key(brt_id),
    foreign key(writer) references user(uid) on delete set null on update cascade
)  Engine =InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists bdc_table;
create table bdc_table(
	bid int unsigned NOT NULL AUTO_INCREMENT,
	origin_own int unsigned,
    current_own int unsigned, 
    kind tinyint unsigned NOT NULL, /** 0은 전혈 1은 성분 **/
    bd_date date NOT NULL,
    usable boolean NOT NULL default true,
    bdc_num int unsigned NOT NULL,
    origin VARCHAR(50) NOT NULL,
    donate_date date default null,
    donate_brtid int unsigned default null,
    primary key(bid),
    foreign key(origin_own) references user(uid) on delete set null on update cascade,
    foreign key(current_own) references user(uid) on delete set null on update cascade,
    foreign key(donate_brtid) references bdc_req_table(brt_id) on delete set null on update cascade,
    unique(bdc_num)
) Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists trans_bdc_table;
create table trans_bdc_table(
	tbt_id int unsigned NOT NULL AUTO_INCREMENT,
    bdc_id int unsigned,
    from_id int unsigned,
    to_id int unsigned,
    trans_date datetime default now(),
    primary key(tbt_id),
    foreign key (bdc_id) references bdc_table(bid) on delete cascade on update cascade,
    foreign key (from_id) references user(uid) on delete set null on update cascade,
    foreign key (to_id) references user(uid) on delete set null on update cascade
) Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists cur_trans_table;
create table cur_trans_table(
	bdc_id int unsigned,
    from_id int unsigned,
    to_id int unsigned,
    reg_date datetime default now(),
    primary key(bdc_id),
    foreign key(bdc_id) references bdc_table(bid) on delete cascade on update cascade,
    foreign key (from_id) references user(uid) on delete set null on update cascade,
    foreign key (to_id) references user(uid) on delete set null on update cascade
)  Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF EXISTS qna_board;
create table qna_board(
	qid int unsigned NOT NULL AUTO_INCREMENT,
    writer int unsigned,
    title VARCHAR(255) NOT NULL,
    content text not null,
    see_num smallint unsigned default 0,
    reg_date datetime default now(),
    primary key(qid),
    foreign key(writer) references user(uid) on delete set null on update cascade
)  Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF EXISTS total_board_num;
create table total_board_num(
	id tinyint unsigned,
    qna_num int unsigned,
    free_num int unsigned,
    primary key(id)
)  Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF EXISTS qna_reply;
create table qna_reply(
	qrid int unsigned NOT NULL AUTO_INCREMENT,
    qid int unsigned NOT NULL,
    writer tinyint unsigned,
    content varchar(255) NOT NULL,
    reg_date datetime default now(),
    primary key(qrid),
    foreign key(qid) references qna_board(qid) on delete cascade on update cascade,
    foreign key(writer) references admin(aid) on delete cascade on update cascade
)  Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF EXISTS free_board;
create table free_board(
	fid int unsigned NOT NULL AUTO_INCREMENT,
    writer int unsigned,
    title varchar(255) NOT NULL,
    content text not null,
    see_num smallint unsigned default 0,
    reg_date datetime default now(),
    primary key(fid),
    foreign key(writer) references user(uid) on delete set null on update cascade
)   Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF EXISTS free_reply;
create TABLE free_reply(
	frid int unsigned NOT NULL AUTO_INCREMENT,
    fid int unsigned NOT NULL,
    writer int unsigned,
    content varchar(255) NOT NULL,
    reg_date datetime default now(),
    primary key(frid),
    foreign key(fid) references free_board(fid) on delete cascade on update cascade,
    foreign key(writer) references user(uid) on delete set null on update cascade
)    Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists hs;
create table hs(
	date date,
	user_num smallint unsigned default 0,
    donate_num smallint unsigned default 0,
    bdc_num smallint unsigned default 0,
    com_req_num smallint unsigned default 0,
    date_num int unsigned default 0,
    primary key(date)
) Engine = InnoDB DEFAULT CHARSET = utf8;
	
    DROP TABLE IF exists hs_week;
create table hs_week(
	date_mon date,
    donate_num int unsigned default 0,
    bdc_num int unsigned default 0,
    com_req_num int unsigned default 0,
    date_num int unsigned default 0,
    total_bdc_num int unsigned,
    primary key(date_mon)
) Engine = InnoDB DEFAULT CHARSET = utf8;

	DROP TABLE IF exists total;
create table total(
	id tinyint unsigned,
	total_com_req_num int unsigned,
    total_date_num bigint unsigned,
    total_bdc_num int unsigned,
    total_donate_num int unsigned,
    total_use_num int unsigned,
    primary key(id)
) Engine = InnoDB DEFAULT CHARSET = utf8;


	DROP EVENT IF exists delete_cur_trans;
DELIMITER |
create event delete_cur_trans
	ON SCHEDULE
		EVERY 1 DAY
        STARTS '2016-11-27 23:59:59'
	DO
	 BEGIN
     update bdc_table SET usable = true WHERE bid IN ( SELECT * FROM (
        SELECT bdc_id FROM cur_trans_table WHERE cur_trans_table.reg_date <date_sub(now() , interval 1 week)
    ) AS p);
     delete from cur_trans_table WHERE cur_trans_table.reg_date < date_sub(now() , interval 1 week); /**1주일 지나면 양도 현황 지워지게 하는거 **/
     END|
    DELIMITER ;
        
	DROP EVENT IF exists hs;
create event hs
	ON SCHEDULE
		EVERY 1 DAY
        STARTS '2016-11-27 23:30:00'
	 DO insert into hs values(current_date() + interval 1 day , 0 , 0 , 0 , 0, 0);
     
     DROP EVENT IF exists finish_bdc_req_by_target;
create event finish_bdc_req_by_target
	ON SCHEDULE
		EVERY 1 DAY
        STARTS '2016-11-27 23:59:57'
	DO UPDATE bdc_req_table set bdc_req_table.finish = true WHERE bdc_req_table.target_date < date(now()) and bdc_req_table.finish = false;
     
        DROP EVENT IF exists hs_week;
create event hs_week
	ON SCHEDULE
		EVERY 1 week
        STARTS '2016-12-03 23:59:58'
        DO 
        INSERT INTO hs_week (date_mon , donate_num , bdc_num , com_req_num , date_num, total_bdc_num)
		SELECT curdate() - 6,
		   sum(hs.donate_num) AS donate_num,
		   sum(hs.bdc_num) AS bdc_num,
           sum(hs.com_req_num) AS com_req_num ,
		   sum(hs.date_num) AS date_num,
           (select total_bdc_num from total WHERE id =1) AS total_bdc_num
		FROM hs 
		WHERE hs.date > curdate() - 7 ;
     
     DROP TRIGGER IF EXISTS plus_hs_bdc_num;
DELIMITER |
create trigger plus_hs_bdc_num after INSERT ON bdc_table
	for each row
    BEGIN
		UPDATE hs SET hs.bdc_num = hs.bdc_num + 1 WHERE date = curdate();
        UPDATE total SET total.total_bdc_num = total.total_bdc_num + 1 WHERE id = 1;
	END|
    DELIMITER ;

	DROP TRIGGER IF EXISTS plus_hs_and_total_com_req_num_and_date_num;
DELIMITER |
create TRIGGER plus_hs_com_req_num_and_date_num AFTER update ON  bdc_req_table
	for each row
    BEGIN
		UPDATE hs SET hs.com_req_num = hs.com_req_num + 1 ,
					  hs.date_num = hs.date_num + (to_days(now()) - to_days(new.reg_date) + 1)
				WHERE new.finish != OLD.finish and hs.date = curdate();
                
		UPDATE total SET total.total_com_req_num = total.total_com_req_num + 1 ,
						 total.total_date_num = total.total_date_num + (to_days(now()) - to_days(new.reg_date) + 1)
			   WHERE new.finish != OLD.finish and total.id = 1;
	END|
    DELIMITER ;
        
             DROP TRIGGER IF EXISTS plus_user_num;
create trigger plus_user_num after INSERT ON user
	for each row
		UPDATE hs SET hs.user_num = hs.user_num + 1 WHERE date = curdate();

	DROP TRIGGER IF EXISTS plus_donate_num;
    DELIMITER &&
create trigger plus_donate_num after UPDATE ON bdc_table
	for each row
    BEGIN
		 UPDATE hs SET hs.donate_num = hs.donate_num + 1 WHERE NEW.donate_brtid IS NOT null AND OLd.donate_brtid IS null AND hs.date = curdate();  
		 UPDATE total SET total.total_donate_num = total.total_donate_num + 1 WHERE NEW.donate_brtid IS NOT null AND OLd.donate_brtid IS null  AND total.id=1;
	END&&
    DELIMITER ;
		
	DROP TRIGGER IF EXISTS delete_cur_trans;
create TRIGGER delete_cur_trans after INSERT ON trans_bdc_table
	for each row
		delete from cur_trans_table WHERE NEW.bdc_id = cur_trans_table.bdc_id; 
	
    DROP TRIGGER IF EXISTS plus_qna_num;
create trigger plus_qna_num after INSERT ON qna_board
	for each row
		UPDATE total_board_num SET total_board_num.qna_num = total_board_num.qna_num + 1 WHERE id=1;

DROP TRIGGER IF EXISTS sub_qna_num;
create trigger sub_qna_num after DELETE ON qna_board
	for each row
		UPDATE total_board_num SET total_board_num.qna_num = total_board_num.qna_num - 1 WHERE id=1;
        
DROP TRIGGER IF EXISTS plus_free_num;
create trigger plus_free_num after INSERT ON  free_board
	for each row
		UPDATE total_board_num SET total_board_num. free_num = total_board_num. free_num + 1 WHERE id=1;

DROP TRIGGER IF EXISTS sub_free_num;
create trigger sub_free_num after DELETE ON  free_board
	for each row
		UPDATE total_board_num SET total_board_num. free_num = total_board_num.free_num - 1 WHERE id=1;
    
SET foreign_key_checks = 1;

insert into total_board_num values( 1 , 0 , 0);
insert into total values(1,0,0,0,0,0);
insert into hs values(now(),0,0,0,0,0);