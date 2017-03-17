ALTER TABLE ljls.member
  ADD COLUMN address varchar(255) NOT NULL
    AFTER email;
