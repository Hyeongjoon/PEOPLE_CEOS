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


	DROP TABLE IF exists bdc_req_table;
create table bdc_req_table(
	brt_id int unsigned NOT NULL AUTO_INCREMENT,
    aim_num tinyint unsigned NOT NULL,
    current_num tinyint unsigned NOT NULL,
    reg_date datetime default now(),
    end_date datetime default now(),
	sur_date date NOT NULL,
    sur_content VARCHAR(255) NOT NULL,
    writer int unsigned,
    content text default NULL,
    hs_id int unsigned,
    primary key(brt_id),
    foreign key(writer) references user(uid) on delete set null on update cascade,
    foreign key(hs_id) references hs_table(hs) on delete set null on update cascade
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

	DROP TABLE IF exists hs_table;
create table hs_table(
	hs int unsigned NOT NULL AUTO_INCREMENT,
    hs_name VARCHAR(50) NOT NULL,
    hs_phone VARCHAR(15) NOT NULL,
    hs_addr VARCHAR(255) NOT NULL,
    primary key(hs)
)  Engine = InnoDB DEFAULT CHARSET = utf8;

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
    reg_bdc_num smallint unsigned default 0,
    primary key(date)
) Engine = InnoDB DEFAULT CHARSET = utf8;
  
	DROP EVENT IF exists delete_cur_trans;
create event delete_cur_trans
	ON SCHEDULE 
		EVERY 1 DAY
        STARTS '2016-11-20 23:59:59'
	 DO 
     delete from cur_trans_table WHERE (to_days(now()) - to_days(cur_trans_table.reg_date)) <8; /**1주일 지나면 양도 현황 지워지게 하는거 **/
        
	DROP EVENT IF exists hs;
create event hs
	ON SCHEDULE 
		EVERY 1 DAY
        STARTS '2016-11-20 23:00:00'
	 DO insert into hs values(current_date() + interval 1 day , 0 , 0 , 0);
     
     DROP TRIGGER IF EXISTS plus_reg_bdc_num;
create trigger plus_reg_bdc_num after INSERT ON bdc_table
	for each row
		UPDATE hs SET hs.reg_bdc_num = hs.reg_bdc_num + 1 WHERE date = curdate();
        
             DROP TRIGGER IF EXISTS plus_user_num;
create trigger plus_user_num after INSERT ON user
	for each row
		UPDATE hs SET hs.user_num = hs.user_num + 1 WHERE date = curdate();

	DROP TRIGGER IF EXISTS plus_donate_num;
create trigger plus_donate_num after UPDATE ON bdc_table
	for each row
		 UPDATE hs SET hs.donate_num = hs.donate_num + 1 WHERE NEW.donate_brtid != OLd.donate_brtid AND date = curdate();  /**이것만 나중에 확인**/
		
        
	DROP TRIGGER IF EXISTS delete_cur_trans;
create TRIGGER delete_cur_trans after INSERT ON trans_bdc_table
	for each row
		delete from cur_trans_table WHERE NEW.bdc_id = cur_trans_table.bdc_id; 
	
SET foreign_key_checks = 1;