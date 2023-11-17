export enum Permission {
	Add = "add", // Add {entity} => Add new {entity} to the team or allow transferring {entity} to this team
	Edit = "edit", // Edit {entity} => Edit settings for the {entity}
	Resubmit = "resubmit", // Resubmit {entity} => Resubmit {entity} on the team
	SetVanity = "set_vanity", // Set {entity} Vanity => Set vanity URL for {entity_plural} on the team
	RequestCert = "request_cert", // Request Certification for {entity} => Request certification for {entity} on the team
	ViewApiTokens = "view_api_tokens", // View Existing {entity} Token => View existing API tokens for {entity} on the team. *DANGEROUS and a potential security risk*
	ResetApiTokens = "reset_api_tokens", // Reset {entity} Token => Reset the API token of {entity_plural} on the team. This is seperate from viewing existing {entity} tokens as that is a much greater security risk
	GetWebhooks = "get_webhooks", // Get {entity} Webhooks => Get {entity} webhook settings. This is independent of updating them (you can still update without this permission)
	EditWebhooks = "edit_webhooks", // Edit {entity} Webhooks => Edit {entity} webhook settings. Note that 'Test {entity} Webhooks' is a separate permission and is required to test webhooks.
	TestWebhooks = "test_webhooks", // Test {entity} Webhooks => Test {entity} webhooks. Note that this is a separate permission from 'Edit {entity} Webhooks' and is required to test webhooks.
	GetWebhookLogs = "get_webhook_logs", // Get {entity} Webhook Logs => Get {entity} webhook logs.
	DeleteWebhookLogs = "delete_webhook_logs", // Delete {entity} Webhook Logs => Delete {entity} webhook logs. Usually requires 'Get {entity} Webhook Logs' to be useful.
	UploadAssets = "upload_assets", // Upload {entity} Assets => Upload assets for {entity} on the team
	DeleteAssets = "delete_assets", // Delete {entity} Assets => Delete assets for {entity} on the team
	CreateOwnerReview = "create_owner_review", // Create {entity} Owner Review => Create an owner review for {entity} on the team. This is a very dangerous permission and should usually never be given to anyone.
	EditOwnerReview = "edit_owner_review", // Edit {entity} Owner Review => Edit an owner review for {entity} on the team. This is a very dangerous permission and should usually never be given to anyone.
	Delete = "delete", // Delete {entity} => Delete a {entity} from the team. This is a very dangerous permission and should usually never be given to anyone.
	Owner = "*", // {entity} Admin => Has full control on {entity}'s.
}