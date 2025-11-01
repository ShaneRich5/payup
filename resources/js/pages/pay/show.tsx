import { Head } from '@inertiajs/react';
import { PageProps, PaymentRequest, PaymentAccount, User } from '@/types';

interface PayShowProps {
  owner: User;
  paymentRequest: PaymentRequest;
  paymentAccounts: Array<PaymentAccount>;
}

export default function Show({ owner, paymentRequest, paymentAccounts }: PayShowProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'venmo':
        return '💙';
      case 'zelle':
        return '🏦';
      case 'paypal':
        return '💙';
      case 'cash_app':
        return '💚';
      default:
        return '💰';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'venmo':
        return 'Venmo';
      case 'zelle':
        return 'Zelle';
      case 'paypal':
        return 'PayPal';
      case 'cash_app':
        return 'Cash App';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'venmo':
        return 'from-blue-500 to-blue-600';
      case 'zelle':
        return 'from-purple-500 to-purple-600';
      case 'paypal':
        return 'from-blue-400 to-blue-500';
      case 'cash_app':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head title={`Payment Request - ${paymentRequest.title || 'Untitled'}`} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Payment Request
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                From {owner.name || owner.email}
              </p>
            </div>
            <span className={getStatusBadge(paymentRequest.status)}>
              {paymentRequest.status}
            </span>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Payment Request Details */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {paymentRequest.title || 'Untitled Request'}
                  </h2>

                  {/* Amount */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(paymentRequest.amount, paymentRequest.currency)}
                    </div>
                  </div>

                  {/* Description */}
                  {paymentRequest.description && (
                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Description
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {paymentRequest.description}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Expires At
                      </div>
                      <div className={`text-sm text-gray-900 dark:text-gray-100 mt-1 ${isExpired(paymentRequest.expires_at) && paymentRequest.status === 'pending'
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                        }`}>
                        {formatDate(paymentRequest.expires_at)}
                      </div>
                    </div>

                    {paymentRequest.paid_at && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Paid At
                        </div>
                        <div className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                          {formatDate(paymentRequest.paid_at)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Accounts */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Available Payment Methods
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select a payment method to pay {owner.name || owner.email}
                </p>
              </div>

              {paymentAccounts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No payment accounts available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {owner.name || owner.email} hasn't set up any payment accounts yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {paymentAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="group relative"
                    >
                      <div className="relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                        {/* Gradient accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getTypeColor(account.type)}`}></div>

                        <div className="p-6">
                          {/* Header with icon */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(account.type)} flex items-center justify-center text-2xl shadow-md ring-2 ring-white dark:ring-gray-800`}>
                              {getTypeIcon(account.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {account.name || account.handle}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                @{account.handle}
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          {account.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                              {account.description}
                            </p>
                          )}

                          {/* Footer with type */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                                {getTypeLabel(account.type)}
                              </span>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

