data "archive_file" "dist_zip" {
  type        = "zip"
  source_dir = "src"
  output_path = "dist.zip"
}

// MARK: Register Lambda

resource "aws_lambda_function" "register_lambda" {
  filename      = "dist.zip"
  function_name = "RegisterFunction"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "src/register.handler"
  source_code_hash = data.archive_file.dist_zip.output_base64sha256
  runtime       = "nodejs16.x"
}

resource "aws_lambda_function" "delete_entry_lambda" {
  filename         = "dist.zip"
  function_name    = "DeleteEntryFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "src/register.delete"
  source_code_hash = data.archive_file.dist_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

resource "aws_lambda_function" "entries_options_lambda" {
  filename          = "dist.zip"
  function_name     = "EntriesOptionsFunction"
  role              = aws_iam_role.lambda_exec_role.arn
  handler           = "src/register.options"
  source_code_hash  = data.archive_file.dist_zip.output_base64sha256
  runtime           = "nodejs16.x"
}

resource "aws_lambda_function" "get_total_time_lambda" {
  filename         = "dist.zip"
  function_name    = "GetTotalTimeFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "src/get_total_time.handler"
  source_code_hash = data.archive_file.dist_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

// MARK: Clients Lambda

resource "aws_lambda_function" "client_get_lambda" {
  filename         = "dist.zip"
  function_name    = "ClientGetFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "src/client.handler"
  source_code_hash = data.archive_file.dist_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

resource "aws_lambda_function" "client_options_lambda" {
  filename          = "dist.zip"
  function_name     = "ClientOptionsFunction"
  role              = aws_iam_role.lambda_exec_role.arn
  handler           = "src/client.options"
  source_code_hash  = data.archive_file.dist_zip.output_base64sha256
  runtime           = "nodejs16.x"
}

resource "aws_lambda_function" "client_create_lambda" {
  filename         = "dist.zip"
  function_name    = "ClientCreateFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "src/client.create"
  source_code_hash = data.archive_file.dist_zip.output_base64sha256
  runtime          = "nodejs16.x"
}

resource "aws_lambda_function" "client_delete_lambda" {
  filename         = "dist.zip"
  function_name    = "ClientDeleteFunction"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "src/client.delete"
  source_code_hash = data.archive_file.dist_zip.output_base64sha256
  runtime          = "nodejs16.x"
}
