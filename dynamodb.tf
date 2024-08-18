resource "aws_dynamodb_table" "time_entries" {
  name           = "TimeEntries"
  hash_key       = "EntryId"
  billing_mode   = "PAY_PER_REQUEST"
  attribute {
    name = "EntryId"
    type = "S"
  }

  attribute {
    name = "ClientId"
    type = "S"
  }

  attribute {
    name = "Duration"
    type = "N"
  }

  attribute {
    name = "Date"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  global_secondary_index {
    name            = "ClientIdIndex"
    hash_key        = "ClientId"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "DateIndex"
    hash_key        = "Date"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "DurationIndex"
    hash_key        = "Duration"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "UserIdIndex"
    hash_key        = "UserId"
    projection_type = "ALL"
  }
}
