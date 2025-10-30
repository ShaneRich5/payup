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
      case 'bank':
        return '🏦';
      case 'card':
        return '💳';
      case 'wallet':
        return '👛';
      case 'crypto':
        return '₿';
      default:
        return '💰';
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">
                            {getTypeIcon(account.type)}
                          </span>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {account.name || account.handle}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{account.handle}
                            </p>
                          </div>
                        </div>
                        <span className={getStatusBadge(account.status)}>
                          {account.status}
                        </span>
                      </div>

                      {account.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {account.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span className="capitalize">{account.type}</span>
                        <span>
                          Created {new Date(account.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/payment-accounts/${account.id}`}
                          className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </Link>
                        <Link
                          href={`/payment-accounts/${account.id}/edit`}
                          className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Edit
                        </Link>
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
