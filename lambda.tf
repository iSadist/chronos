data "archive_file" "register_zip" {
  type        = "zip"
  source_file  = "register.js"
  output_path = "register.zip"
}

resource "aws_lambda_function" "register_lambda" {
  filename      = "register.zip"
  function_name = "RegisterFunction"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "register.handler"
  source_code_hash = data.archive_file.register_zip.output_base64sha256
  runtime       = "nodejs16.x"
}

data "archive_file" "get_total_time_zip" {
  type        = "zip"
  source_file = "get_total_time.js"
  output_path = "get_total_time.zip"
}

resource "aws_lambda_function" "get_total_time_lambda" {
  filename         = "get_total_time.zip"
  function_name    = "GetTotalTimeFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "get_total_time.handler"
  source_code_hash = data.archive_file.get_total_time_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

// MARK: Clients Lambda

data "archive_file" "client_zip" {
  type        = "zip"
  source_file = "client.js"
  output_path = "client.zip"
}

resource "aws_lambda_function" "client_get_lambda" {
  filename         = "client.zip"
  function_name    = "ClientGetFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "client.handler"
  source_code_hash = data.archive_file.client_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

resource "aws_lambda_function" "client_create_lambda" {
  filename         = "client.zip"
  function_name    = "ClientCreateFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "client.create"
  source_code_hash = data.archive_file.client_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

resource "aws_lambda_function" "client_delete_lambda" {
  filename         = "client.zip"
  function_name    = "ClientDeleteFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "client.delete"
  source_code_hash = data.archive_file.client_zip.output_base64sha256
  runtime          = "nodejs16.x"
}
