import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, PaymentAccount } from '@/types';
import PrimaryButton from '@/components/PrimaryButton';
import { useState } from 'react';

interface PaymentAccountsIndexProps extends PageProps {
  paymentAccounts: Array<PaymentAccount>;
}

export default function Index({ auth, paymentAccounts }: PaymentAccountsIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = paymentAccounts.filter(account =>
    account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
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
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Payment Accounts
          </h2>
          <Link href="/payment-accounts/create">
            <PrimaryButton>Add Payment Account</PrimaryButton>
          </Link>
        </div>
      }
    >
      <Head title="Payment Accounts" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search payment accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Payment Accounts List */}
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {searchTerm ? 'No matching accounts found' : 'No payment accounts yet'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Get started by adding your first payment account'
                    }
                  </p>
                  {!searchTerm && (
                    <Link href="/payment-accounts/create">
                      <PrimaryButton>Add Payment Account</PrimaryButton>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="group relative"
                    >
                      <div className="relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                        {/* Gradient accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getTypeColor(account.type)}`}></div>

                        <div className="p-6">
                          {/* Header with icon and status */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(account.type)} flex items-center justify-center text-2xl shadow-md ring-2 ring-white dark:ring-gray-800`}>
                                {getTypeIcon(account.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/payment-accounts/${account.id}`}
                                  className="block"
                                >
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {account.name || account.handle}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                  @{account.handle}
                                </p>
                              </div>
                            </div>
                            <span className={getStatusBadge(account.status)}>
                              {account.status}
                            </span>
                          </div>

                          {/* Description */}
                          {account.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[2.5rem]">
                              {account.description}
                            </p>
                          )}

                          {/* Footer with type and date */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                                {getTypeLabel(account.type)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(account.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {/* Action buttons - visible on hover */}
                          <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 rounded-xl">
                            <Link
                              href={`/payment-accounts/${account.id}`}
                              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
                            >
                              View Details
                            </Link>
                            <Link
                              href={`/payment-accounts/${account.id}/edit`}
                              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                            >
                              Edit
                            </Link>
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
    </AuthenticatedLayout>
  );
}
