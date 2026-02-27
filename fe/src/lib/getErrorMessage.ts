import { ApolloError } from "@apollo/client";

/**
 * Extracts a user-friendly error message from a GraphQL/Apollo error.
 * NestJS validation errors come in extensions.originalError.message (as an array).
 */
export function getErrorMessage(err: ApolloError): string {
    const gqlError = err.graphQLErrors?.[0];

    if (gqlError) {
        // NestJS validation pipe errors
        const originalMessage = (
            gqlError.extensions as Record<string, unknown> | undefined
        )?.originalError as { message?: string | string[] } | undefined;

        if (originalMessage?.message) {
            if (Array.isArray(originalMessage.message)) {
                return originalMessage.message.join(". ");
            }
            return originalMessage.message;
        }

        return gqlError.message;
    }

    if (err.networkError) {
        return "Network error. Please check your connection.";
    }

    return err.message || "Something went wrong";
}
