import { Head } from '@inertiajs/react';
import { PageProps, PaymentAccount, User } from '@/types';

interface PayIndexProps {
  owner: User;
  paymentAccounts: Array<PaymentAccount>;
}

export default function Index({ owner, paymentAccounts }: PayIndexProps) {
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
      <Head title={`Pay @${owner.name || owner.email}`} />

      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Pay {owner.name || owner.email}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Select a payment method below
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {paymentAccounts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No payment accounts available
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This user hasn't set up any payment accounts yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[2.5rem]">
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
  );
}

