resource "aws_apigatewayv2_api" "chronos_api" {
  name          = "ChronosAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.chronos_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.chronos_lambda.arn
}

resource "aws_apigatewayv2_route" "chronos_route" {
  api_id    = aws_apigatewayv2_api.chronos_api.id
  route_key = "POST /time-entry"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "dev" {
  api_id      = aws_apigatewayv2_api.chronos_api.id
  name        = "dev"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "get_total_time_integration" {
  api_id           = aws_apigatewayv2_api.chronos_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_total_time_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "get_total_time_route" {
  api_id    = aws_apigatewayv2_api.chronos_api.id
  route_key = "GET /getTotalTime"
  target    = "integrations/${aws_apigatewayv2_integration.get_total_time_integration.id}"
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_total_time_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.chronos_api.execution_arn}/*/*"
}