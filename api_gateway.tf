resource "aws_apigatewayv2_api" "chronos_api" {
  name          = "ChronosAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "dev" {
  api_id      = aws_apigatewayv2_api.chronos_api.id
  name        = "dev"
  auto_deploy = true
}

// MARK: Register Lambda

resource "aws_apigatewayv2_integration" "register_integration" {
  api_id           = aws_apigatewayv2_api.chronos_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.register_lambda.arn
}

resource "aws_apigatewayv2_route" "register_route" {
  api_id    = aws_apigatewayv2_api.chronos_api.id
  route_key = "GET /entries"
  target    = "integrations/${aws_apigatewayv2_integration.register_integration.id}"
}

resource "aws_lambda_permission" "register_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.chronos_api.execution_arn}/*/*"
}

// MARK: Total Time Lambda

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

// MARK: Client Lambda

# New integration for client Lambda
resource "aws_apigatewayv2_integration" "client_lambda_integration" {
  api_id           = aws_apigatewayv2_api.chronos_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.client_lambda.arn
}

# New route for client Lambda
resource "aws_apigatewayv2_route" "client_lambda_route" {
  api_id    = aws_apigatewayv2_api.chronos_api.id
  route_key = "GET /clients"
  target    = "integrations/${aws_apigatewayv2_integration.client_lambda_integration.id}"
}

# Permissions for API Gateway to invoke client Lambda
resource "aws_lambda_permission" "client_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvokeClientLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.client_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.chronos_api.execution_arn}/*/*"
}