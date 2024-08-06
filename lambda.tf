data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file  = "index.js"
  output_path = "lambda.zip"
}

resource "aws_lambda_function" "chronos_lambda" {
  filename      = "lambda.zip"
  function_name = "ChronosFunction"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
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