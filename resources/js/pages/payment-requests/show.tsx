import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, PaymentRequest } from '@/types';
import PrimaryButton from '@/components/PrimaryButton';
import DangerButton from '@/components/DangerButton';
import { useState } from 'react';

interface PaymentRequestShowProps extends PageProps {
  paymentRequest: PaymentRequest;
}

export default function Show({ auth, paymentRequest }: PaymentRequestShowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = () => {
    router.delete(`/payment-requests/${paymentRequest.id}`, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
    });
  };

  const getShareableLink = () => {
    return `${window.location.origin}/payment-requests/${paymentRequest.token}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Payment Request Details
          </h2>
          <div className="flex space-x-2">
            {paymentRequest.status === 'pending' && (
              <Link href={`/payment-requests/${paymentRequest.id}/edit`}>
                <PrimaryButton>Edit</PrimaryButton>
              </Link>
            )}
            <DangerButton onClick={() => setShowDeleteModal(true)}>
              Delete
            </DangerButton>
          </div>
        </div>
      }
    >
      <Head title={`Payment Request - ${paymentRequest.title || 'Untitled'}`} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Details Card */}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {paymentRequest.title || 'Untitled Request'}
                  </h3>
                  <span className={getStatusBadge(paymentRequest.status)}>
                    {paymentRequest.status}
                  </span>
                </div>

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
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Description
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {paymentRequest.description}
                    </dd>
                  </div>
                )}

                {/* Payment Account */}
                {paymentRequest.payment_account && (
                  <div className="mb-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Payment Account
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-100">
                      <Link
                        href={`/payment-accounts/${paymentRequest.payment_account.id}`}
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {paymentRequest.payment_account.name || paymentRequest.payment_account.handle}
                      </Link>
                    </dd>
                  </div>
                )}

                {/* Token & Shareable Link */}
                <div className="mb-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Shareable Link
                  </dt>
                  <dd className="flex items-center space-x-2">
                    <code className="flex-1 text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded break-all">
                      {getShareableLink()}
                    </code>
                    <button
                      onClick={() => copyToClipboard(getShareableLink())}
                      className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Copy
                    </button>
                  </dd>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Token
                    </dt>
                    <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                      {paymentRequest.token}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      UUID
                    </dt>
                    <dd className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                      {paymentRequest.uuid}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expires At
                    </dt>
                    <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${isExpired(paymentRequest.expires_at) && paymentRequest.status === 'pending'
                      ? 'text-red-600 dark:text-red-400'
                      : ''
                      }`}>
                      {formatDate(paymentRequest.expires_at)}
                    </dd>
                  </div>

                  {paymentRequest.paid_at && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Paid At
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(paymentRequest.paid_at)}
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(paymentRequest.created_at)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(paymentRequest.updated_at)}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Metadata
                </h4>

                {paymentRequest.metadata && Object.keys(paymentRequest.metadata).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(paymentRequest.metadata).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {key}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </dd>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No metadata available for this payment request.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Link
              href="/payment-requests"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to Payment Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle dark:bg-gray-800">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                      Delete Payment Request
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this payment request? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700">
                <DangerButton
                  onClick={handleDelete}
                  className="w-full sm:ml-3 sm:w-auto"
                >
                  Delete
                </DangerButton>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-500"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

