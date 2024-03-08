// These are generic enums used throughout the app.

const Enums = {
  paymentStatuses: {
    PREPARING: 'Preparing to execute payments...',
    FETCHING_POSTS: 'Fetching posts to Diamond...',
    EXECUTING: 'Executing payments...',
    FINALIZING: 'Finalizing payments...',
    SUCCESS: 'Payments executed successfully!',
    ERROR:
      'Apologies: An unknown error occurred. Please inform the @DeSoOps team. No payment transactions have been as yet.',
    ERROR_PAYMENT_TRANSACTION: 'Error executing some of the payments. Please review below the details.'
  }
}

export default Enums
