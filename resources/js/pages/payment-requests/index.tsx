import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, PaymentRequest } from '@/types';
import PrimaryButton from '@/components/PrimaryButton';
import { useState } from 'react';

interface PaymentRequestsIndexProps extends PageProps {
  paymentRequests: Array<PaymentRequest>;
}

export default function Index({ auth, paymentRequests }: PaymentRequestsIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = paymentRequests.filter(request =>
    request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.token.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Payment Requests
          </h2>
          <Link href="/payment-requests/create">
            <PrimaryButton>Create Payment Request</PrimaryButton>
          </Link>
        </div>
      }
    >
      <Head title="Payment Requests" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search payment requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Payment Requests List */}
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💸</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {searchTerm ? 'No matching requests found' : 'No payment requests yet'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Get started by creating your first payment request'
                    }
                  </p>
                  {!searchTerm && (
                    <Link href="/payment-requests/create">
                      <PrimaryButton>Create Payment Request</PrimaryButton>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      className="group relative"
                    >
                      <div className="relative overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
                        {/* Status accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${request.status === 'paid' ? 'bg-green-500' :
                          request.status === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>

                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/payment-requests/${request.id}`}
                                className="block"
                              >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  {request.title || 'Untitled Request'}
                                </h3>
                              </Link>
                              {request.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {request.description}
                                </p>
                              )}
                            </div>
                            <span className={getStatusBadge(request.status)}>
                              {request.status}
                            </span>
                          </div>

                          {/* Amount */}
                          <div className="mb-4">
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                              {formatCurrency(request.amount, request.currency)}
                            </div>
                            {request.payment_account && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                via {request.payment_account.name || request.payment_account.handle}
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Token:</span>
                              <span className="font-mono text-gray-900 dark:text-gray-100">{request.token}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                              <span className={`text-gray-900 dark:text-gray-100 ${isExpired(request.expires_at) && request.status === 'pending' ? 'text-red-600 dark:text-red-400' : ''
                                }`}>
                                {formatDate(request.expires_at)}
                              </span>
                            </div>
                            {request.paid_at && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400">Paid:</span>
                                <span className="text-gray-900 dark:text-gray-100">
                                  {formatDate(request.paid_at)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action buttons - visible on hover */}
                          <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 rounded-xl">
                            <Link
                              href={`/payment-requests/${request.id}`}
                              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
                            >
                              View Details
                            </Link>
                            {request.status === 'pending' && (
                              <Link
                                href={`/payment-requests/${request.id}/edit`}
                                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
                              >
                                Edit
                              </Link>
                            )}
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

