terraform {
required_providers {
aws = {
source = "hashicorp/aws"
version = "4.22.0"
}
}
}
provider "aws" {
access_key = "AKIAYB64KN76D6VP7LOV"
secret_key = "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"
region = "us-east-1"
}
resource "aws_instance" "edustaff" {
  ami           = "ami-06e46074ae430fba6"
  instance_type = "t2.micro"
  associate_public_ip_address = true
  /* user_data = file("user1.sh") */
  key_name      = "newkp"
  tags = {
    Name = "Yash_Instance"
  }
}
resource "aws_db_instance" "yashrdsinstance" {
allocated_storage = 10
engine = "mysql"
engine_version = "5.7"
instance_class = "db.t3.micro"
storage_type = "gp2"
name = "mydb"
username = "yash"
password = "        "
parameter_group_name = "default.mysql5.7"
skip_final_snapshot = true
}

output "db_instance_endpoint" {
description = "The connection endpoint"
value = aws_db_instance.yashrdsinstance.address
}