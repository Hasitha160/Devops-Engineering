terraform {
  backend "s3" {
    bucket         = "devops-terraform-state-hasitha"
    key            = "terraform-cd/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-locks"
  }
}
